from django.shortcuts import render
from rest_framework.decorators import api_view
from ..serializers import buildingMaterialSerializer, singleByggSerializer, KoordinaterSerializer, MaterialerSerializer
from ..models import materialtype, Bygning as bygning, Koordinater as koordinater, materialer, Byggningsinfo
from rest_framework.response import Response
from django.core.paginator import Paginator 
from django.db.models import F, IntegerField, Value, FloatField
from django.db.models.functions import Power, Sqrt



@api_view(['GET'])
def get_allBygningByMaterial(request):

    # format materials-parameter
    materialids = request.GET.get('materials', None)
    if (materialids != None):
        materialids = materialids.split(",")
        materialids = [int(i) for i in materialids]
    
    # format buildingtypes-parameter
    buildingtypes = request.GET.get('buildingtypes', None)
    if (buildingtypes != None):
        buildingtypes = buildingtypes.split(",")
        buildingtypes = [int(i) for i in buildingtypes]
    
    
    # get parameters related to area
    limitarea = int(request.GET.get('limitarea', 0))
    latstart = float(request.GET.get('latstart', 0))
    latend = float(request.GET.get('latend', 0))
    longstart = float(request.GET.get('longstart', 0))
    longend = float(request.GET.get('longend', 0))
    
    # spitballing, will test
    # material = materialer.objects.filter(type_materiale = type.id)
    # should be checked if this actually works. the thought is to filter materials by the id taken from materialtype and filter by it, before selecting the relevant tables.
    # possible last select can be omitted, needs testing 
    #bygg = buildingMaterialSerializer(bygning.objects.select_related('bygnignsnr').all().filter(type_materiale=materialid).values("bygnignsnr", "totalmengde", "x", "y"))
    #bygg = materialer.objects.filter(type_materiale=materialid).select_related("").values(
    #    "bygning", "totalmengde", "koordinater__x", "koordinater__y"
    #)


    # filter out tilbygg (as there is only one koordinat for each building)
    b = koordinater.objects.select_related('bygning').filter(
        bygning__byggningsinfo__tilbyggsnr__isnull=True  
    )
  
    if limitarea == 1:
        # filter by coordinates
        b = b.filter(
            latitude__gte=latstart,
            latitude__lte=latend,
            longitude__gte=longstart,
            longitude__lte=longend
        )

    # filter by buildingtype-param
    if buildingtypes != None:
        b = b.filter(
            bygning__byggningsinfo__byggningstypekode__in=buildingtypes)
    
    # transform to fit serializer and wanted format
    b = b.annotate(
        building=F("bygning__byggningsnr"),
        totalamount=Value(10),  
    ).values(
        "building",
        "totalamount",
        "latitude",
        "longitude"
    )

    serialized = buildingMaterialSerializer(b, many=True)
    return Response(serialized.data, status=200)


    r = []
    # mapping the data to the correct format
    for i in range(len(serialized.data)):
        rr = {
            "x": serialized.data[i]['x'],
            "y": serialized.data[i]['y'],
            "building": serialized.data[i]['bygningid'],
            "totalamount": 10,
        }
        r.append(rr) 
    
  
    return Response(r, status=200)

    bygg = materialer.objects.filter(type_materiale=materialid).select_related('bygning').select_related('koordinater').annotate(
        building=F("bygning__bygnignsnr"),
        totalamount=F("totalmengde"),      
        x=F("bygning__koordinater__x"), 
        y=F("bygning__koordinater__y")   
    ).values(
        "building", 
        "totalamount",
        "x",
        "y"
    )
    serialized = buildingMaterialSerializer(bygg, many=True)

    return Response(serialized.data, status=200)
   

# needs error handling, but first test if it works
@api_view(['GET'])
def get_singleBygningById(_, bygningsnr):
    try: 
        # get main building
        bygg = Byggningsinfo.objects.select_related('bygning').filter(
            tilbyggsnr__isnull=True,
        ).annotate(
            byggningsnr=F("bygning__byggningsnr"),
            bygdDato=F("bygning__byggdato"),
        ).get(
            byggningsnr=int(bygningsnr)
        )
      
       # bygning.objects.get(bygningsnr=int(bygningsnr))

    except bygning.DoesNotExist:
        return Response({"error": f'bygning with id {bygningsnr} does not exist'}, status=404)
    serialized = singleByggSerializer(bygg)
    
    return Response(serialized.data, status=200)

# note, not sure if casting to string and then char is the best way to pass floats to the backend.
@api_view(['GET'])
def get_squareSelect(request):
    x1 = float(request.GET.get("x1", 0))
    x2 = float(request.GET.get("x2", 0))
    y1 = float(request.GET.get("y1", 0))
    y2 = float(request.GET.get("y2", 0))
    result = koordinater.objects.filter(x__gte=x1, x__lte=x2, y__gte=y1, y__lte=y2)
    serialized = KoordinaterSerializer(result, many=True)
    return Response(serialized.data, status=200)

# get closest building near coordinates, used when getting building after an address search etc.
@api_view(['GET'])
def get_closestbuilding(request):
    lat = float(request.GET.get("lat", 0))
    lon = float(request.GET.get("lon", 0))

    if lat == 0 or lon == 0:
        return Response({"error": "missing coordinates"}, status=400)

    k = koordinater.objects.annotate(
        distance=Sqrt(
            Power(F('latitude') - lat, 2) + Power(F('longitude') - lon, 2)
        )
    ).order_by('distance').first()

    if not k:
        return Response({"error": "no buildings found"}, status=404)
    

    try: 
        # get detailed building
        bygg = Byggningsinfo.objects.select_related('bygning').filter(
            tilbyggsnr__isnull=True,
        ).annotate(
            byggningsnr=F("bygning__byggningsnr"),
            bygdDato=F("bygning__byggdato"),
        ).get(
            byggningsnr=int(k.bygning.byggningsnr)
        )
      
    except bygning.DoesNotExist:
        #shouldnt occur
        return Response({"error": 'interal error'}, status=500)
    
    serialized = singleByggSerializer(bygg)
    
    return Response(serialized.data, status=200)

# combination of closest building and bygningbymaterials, gets a single bygning with same format return format as bygningbymaterials 
@api_view(['GET'])
def get_closestbuilding_material(request):
    lat = float(request.GET.get("lat", 0))
    lon = float(request.GET.get("lon", 0))

    if lat == 0 or lon == 0:
        return Response({"error": "missing coordinates"}, status=400)

    k = koordinater.objects.annotate(
        distance=Sqrt(
            Power(F('latitude') - lat, 2) + Power(F('longitude') - lon, 2)
        )
    ).order_by('distance').first()

    if not k:
        return Response({"error": "no buildings found"}, status=404)
    

    try: 
        # get detailed building
        bygg = Byggningsinfo.objects.select_related('bygning').filter(
            tilbyggsnr__isnull=True,
        ).annotate(
            byggningsnr=F("bygning__byggningsnr"),
        ).values(
            "byggningsnr"
        ).get(
            byggningsnr=int(k.bygning.byggningsnr)
        )
      
    except bygning.DoesNotExist:
        #shouldnt occur
        return Response({"error": 'interal error'}, status=500)
    
    byggnr = bygg["byggningsnr"]


    b = koordinater.objects.select_related('bygning').filter(
        bygning__byggningsinfo__tilbyggsnr__isnull=True
    )

    print(byggnr)
    b = b.filter(
        bygning__byggningsnr=byggnr
    )

    # print keys



    if not b:
        return Response({"error": "no buildings found"}, status=404)
  
    # transform to fit serializer and wanted format
    b = b.annotate(
        building=F("bygning_id"),
        totalamount=Value(10),  
    )
    print(b.values())
    b = b.values(
        "building",
        "totalamount",
        "latitude",
        "longitude"
    )

    serialized = buildingMaterialSerializer(b, many=True)
    if not serialized.data:
        return Response({"error": "no buildings found"}, status=404)

  #  print(serialized.data)

    return Response(b[0], status=200)