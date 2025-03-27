from django.shortcuts import render
from rest_framework.decorators import api_view
from .serializers import WasteReportDTOSerializer, RapportSerializer, RapportMaterialeSerializer
from rest_framework.response import Response

# Create your views here.

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



