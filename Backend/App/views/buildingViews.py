from django.shortcuts import render
from rest_framework.decorators import api_view
from ..serializers import buildingMaterialSerializer, singleByggSerializer, KoordinaterSerializer
from ..models import materialtype, bygning, materialtype, koordinater
from rest_framework.response import Response
from django.core.paginator import Paginator 

@api_view(['GET'])
def get_allByngingByMaterial(request):
    param = request.GET.get('material', 'default')
    if(param =='default'):
        return 0
    
    type = materialtype.objects.get(navn=param)
    # spitballing, will test
    # material = materialer.objects.filter(type_materiale = type.id)
    bygg = buildingMaterialSerializer(bygning.objects.select_related('bygnignsnr').all().filter(type_materiale=type.id).values("bygnignsnr", "totalmengde", "x", "y"))

    return Response(bygg.data, status=200)
# needs error handling, but first test if it works
@api_view(['GET'])
def get_singleBygningById(request):
    return Response(singleByggSerializer(bygning.objects.get(bygnignsnr=request.GET.get('bygningsnr', 0))))

# note, not sure if casting to string and then char is the best way to pass floats to the backend.
def get_squareSelect(request):
    x1 = float(request.GET.get(x1, 0))
    x2 = float(request.GET.get(x2, 0))
    y1 = float(request.GET.get(y1, 0))
    y2 = float(request.GET.get(y2, 0))
    result = koordinater.objects.filter('x'>=x1, 'x'<=x2, 'y'>=y1, 'y'<=y2)
    return KoordinaterSerializer(result)
