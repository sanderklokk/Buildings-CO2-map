from django.shortcuts import render
from rest_framework.decorators import api_view
from .serializers import WasteReportDTOSerializer, RapportSerializer, RapportMaterialeSerializer, MaterialTypeSerializer
from .models import materialtype
from rest_framework.response import Response

# Create your views here.


# Create new waste report
@api_view(['POST'])
def post_wastereport(request):
    serialized =  WasteReportDTOSerializer(data=request.data)

    if (not serialized.is_valid()):
        return Response(serialized.errors, status=400)
    
    reportdata = serialized.validated_data
    materialer = reportdata.pop('materialer')

    report = RapportSerializer(data=reportdata)
    if (not report.is_valid(raise_exception=True)):
        return Response(report.errors, status=400)
    
    savedreport = report.save()
    for material in materialer:
        material['rapport'] = savedreport.id
        materialserializer = RapportMaterialeSerializer(data=material)
        if (not materialserializer.is_valid(raise_exception=True)):
            return Response(materialserializer.errors, status=400)
        materialserializer.save()

    return Response(status=200)


# Get all material types
@api_view(['GET'])
def get_materialtypes(_):
    materialtypes = MaterialTypeSerializer(materialtype.objects.all(), many=True)
    return Response(materialtypes.data, status=200)