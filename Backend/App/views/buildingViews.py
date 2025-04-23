from django.shortcuts import render
from rest_framework.decorators import api_view
from ..serializers import buildingMaterialSerializer, singleByggSerializer, KoordinaterSerializer, MaterialerSerializer
from ..models import materialtype, Bygning as bygning, Koordinater as koordinater, materialer, Byggningsinfo
from rest_framework.response import Response
from django.core.paginator import Paginator 
from django.db.models import F, IntegerField, Value, FloatField, Sum, Case, When
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
    
    # select related mateirals (left join to get all buildings)
    b = b.prefetch_related("bygning__materialer")
    
    # filter chosen materials
    if materialids != None:
        b = b.annotate(
            totalamount=Sum(Case(
            When(bygning__materialer__type_materiale__in=materialids, then=F("bygning__materialer__totalmengde")),
            default=Value(0, output_field=FloatField()),
            output_field=FloatField(),
                )
            )
        )
    else:
        # if no materials get all
        b = b.annotate(
            totalamount=Sum("bygning__materialer__totalmengde", default=Value(0, output_field=FloatField()))
        )
    
    # transform to fit serializer and wanted format
    b = b.annotate(
        building=F("bygning__byggningsnr")
    ).values(
        "building",
        "totalamount",
        "latitude",
        "longitude"
    ).distinct()

    serialized = buildingMaterialSerializer(b, many=True)
    return Response(serialized.data, status=200)


# needs error handling, but first test if it works
@api_view(['GET'])
def get_singleBygningById(_, bygningsnr):
    try: 
        # get main building with needed info
        bygg = Byggningsinfo.objects.select_related('bygning').filter(
            tilbyggsnr__isnull=True,
        ).annotate(
            byggningsnr=F("bygning__byggningsnr"),
            bygdDato=F("bygning__byggdato"),
        ).get(
            byggningsnr=int(bygningsnr)
        )

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

    # check params 
    if lat == 0 or lon == 0:
        return Response({"error": "missing coordinates"}, status=400)

    # get closest building by calculatig distance
    k = koordinater.objects.annotate(
        distance=Sqrt(
            Power(F('latitude') - lat, 2) + Power(F('longitude') - lon, 2)
        )
    ).order_by('distance').first()

    # check if any building was found (should never happen)
    if not k:
        return Response({"error": "no buildings found"}, status=404)
    
    # get related info and get results
    try: 
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

    # get koordinater closest to coordinates
    k = koordinater.objects.annotate(
        distance=Sqrt(
            Power(F('latitude') - lat, 2) + Power(F('longitude') - lon, 2)
        )
    ).order_by('distance').first()
    if not k:
        return Response({"error": "no buildings found"}, status=404)
    
    # get building from closest koordinater
    try: 
        bygg = bygning.objects.filter(
            byggningsnr=int(k.bygning.byggningsnr)
        )
    except bygning.DoesNotExist:
        #shouldnt occur
        return Response({"error": 'interal error'}, status=500)
    
    # get koordinater and format results
    bygg = bygg.select_related("koordinater").annotate(
        building=F("byggningsnr"),
        latitude=F("koordinater__latitude"),
        longitude=F("koordinater__longitude")
    )

    # get total materials and get result
    bygg = bygg.select_related("materialer").annotate(
        totalamount=Sum("materialer__totalmengde", default=Value(0, output_field=FloatField()))
    ).values(
        "building",
        "latitude",
        "longitude",
        "totalamount"
    ).distinct()


    serialized = buildingMaterialSerializer(bygg, many=True)
    if not serialized.data:
        return Response({"error": "no buildings found"}, status=404)

    # return first instance (there is only one)
    return Response(bygg[0], status=200)