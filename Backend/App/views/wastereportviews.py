# VIEWS / API Endpoints related to waste reports

from rest_framework.decorators import api_view
from ..serializers import WasteReportDTOSerializer, RapportSerializer, RapportMaterialeSerializer, MaterialTypeSerializer
from ..models import rapport, rapportmateriale
from rest_framework.response import Response
from django.core.paginator import Paginator 

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



# Get list of reports with page/count/search filters. Less detailjed objects without list of materials
@api_view(['GET'])
def get_all_wastereports(request):
    page = request.GET.get('page', 1)
    count = request.GET.get('count', 10)
    search = request.GET.get('search', "")
    
    p = Paginator(rapport.objects.order_by("id").filter(address__contains=search), count)
    res = p.get_page(page)

    reports = RapportSerializer(res, many=True)
    totalreports = {
        'total': p.count,
        'results': reports.data
    }
    for report in totalreports['results']:
        r =  sum([x["faktiskmengde"] for x in RapportMaterialeSerializer(rapportmateriale.objects.filter(rapport=report['id']), many=True).data])
        report['totalmaterials'] = r

    return Response(totalreports, status=200)

# Get detailjed report. contains all data with materials
@api_view(['GET'])
def get_wastereport(_, id):
    try:
        report = RapportSerializer(rapport.objects.get(id=id))
    except rapport.DoesNotExist:
        return Response(status=404)
    
    reportdata = report.data
    materials = rapportmateriale.objects.filter(rapport=reportdata['id']).select_related("materiale")

    serialized = RapportMaterialeSerializer(materials, many=True).data
    for i in range(len(serialized)):
        print(materials[i].materiale.forelder)
        serialized[i]['navn'] = materials[i].materiale.navn
        serialized[i]['farlig'] = materials[i].materiale.farlig
    
        parent = MaterialTypeSerializer(data=materials[i].materiale.forelder)
        if parent.is_valid():
            serialized[i]['parent'] = parent.data['id']
        else:
            serialized[i]['parent'] = None
            
    reportdata['materialer'] = serialized
    reportdata['totalmaterials'] =  sum([x["faktiskmengde"] for x in serialized])
        
    return Response(reportdata, status=200)
