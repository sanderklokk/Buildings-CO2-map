from django.shortcuts import render
from rest_framework.decorators import api_view
from ..serializers import buildingMaterialSerializer, singleByggSerializer, KoordinaterSerializer, MaterialerSerializer
from ..models import materialtype, Bygning as bygning, Koordinater as koordinater, materialer
from rest_framework.response import Response
from django.core.paginator import Paginator 
from django.db.models import F



@api_view(['GET'])
def get_allBygningByMaterial(request):
    materialid = request.GET.get('material', None)
    if (materialid == None):
        return "Error: invalid material type"
    
    # spitballing, will test
    # material = materialer.objects.filter(type_materiale = type.id)
    # should be checked if this actually works. the thought is to filter materials by the id taken from materialtype and filter by it, before selecting the relevant tables.
    # possible last select can be omitted, needs testing 
    #bygg = buildingMaterialSerializer(bygning.objects.select_related('bygnignsnr').all().filter(type_materiale=materialid).values("bygnignsnr", "totalmengde", "x", "y"))
    #bygg = materialer.objects.filter(type_materiale=materialid).select_related("").values(
    #    "bygning", "totalmengde", "koordinater__x", "koordinater__y"
    #)
    bygg = materialer.objects.filter(type_materiale=materialid).select_related('Bygning').select_related('Koordinater').annotate(
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
        bygg = bygning.objects.get(bygnignsnr=int(bygningsnr))
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

