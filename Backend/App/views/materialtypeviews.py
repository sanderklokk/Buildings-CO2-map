# VIEWS / API Endpoints related to managing material types

from django.shortcuts import render
from rest_framework.decorators import api_view
from ..serializers import WasteReportDTOSerializer, RapportSerializer, RapportMaterialeSerializer, MaterialTypeSerializer
from ..models import materialtype, rapport, rapportmateriale
from rest_framework.response import Response
from django.core.paginator import Paginator 

# Get all material types
@api_view(['GET'])
def get_materialtypes(_):
    materialtypes = MaterialTypeSerializer(materialtype.objects.all(), many=True)
    return Response(materialtypes.data, status=200)

# Create new materialtype
@api_view(['POST'])
def create_materialtype(request):
    mattype = MaterialTypeSerializer(data=request.data)
    if (not mattype.is_valid()):
        return Response(mattype.errors, status=400)
 
    saved = mattype.save()

    return Response(MaterialTypeSerializer(saved).data, status=200)

