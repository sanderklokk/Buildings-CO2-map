# VIEWS / API Endpoints related to managing material types

from django.shortcuts import render
from rest_framework.decorators import api_view
from ..serializers import WasteReportDTOSerializer, RapportSerializer, RapportMaterialeSerializer, MaterialTypeSerializer
from ..models import materialtype, rapport, rapportmateriale
from rest_framework.response import Response
from django.core.paginator import Paginator 

# Get all material types
@api_view(['GET'])
def get_materialtypes(request):
    includehidden = int(request.GET.get('includehidden', 0))
    print("includehidden", includehidden)
    if includehidden == 1:
        materialtypes = MaterialTypeSerializer(materialtype.objects.all(), many=True)
    else:
        materialtypes = MaterialTypeSerializer(materialtype.objects.exclude(synlig=False), many=True)

    return Response(materialtypes.data, status=200)

# Create new materialtype
@api_view(['POST'])
def create_materialtype(request):
    mattype = MaterialTypeSerializer(data=request.data)
    if (not mattype.is_valid()):
        return Response(mattype.errors, status=400)
 
    saved = mattype.save()

    return Response(MaterialTypeSerializer(saved).data, status=200)

# Update list of materials
@api_view(['PUT'])
def update_materialtype(request):
    materials = request.data

    updated_materials = []
    for material in materials:
        try:
            mattype = materialtype.objects.get(id=material["id"])
        except materialtype.DoesNotExist:
            return Response({"error": "Material type not found"}, status=404)
        
        serialized = MaterialTypeSerializer(mattype, data=material)
        if (not serialized.is_valid()):
            return Response(serialized.errors, status=400)

        saved = serialized.save()
        updated_materials.append(MaterialTypeSerializer(saved).data)

    return Response(updated_materials, status=200)



# Delete materialtype
@api_view(['DELETE'])
def delete_materialtype(request):
    mattype_id = request.data.get("id")
    try:
        mattype = materialtype.objects.get(id=mattype_id)
    except materialtype.DoesNotExist:
        return Response({"error": "Material type not found"}, status=404)
    
    # cant delete "hovedmateriale"
    if (mattype.forelder == None):
        return Response({"error": "Cannot delete hovedmateriale"}, status=400)

    # handle transferring waste amounts 
    #    make deleted materials parent -> parent of deleted materials children + add deleted materials amount to parent

    # childrentypes
    children = materialtype.objects.filter(forelder=mattype)
    impacted_materials = []
    # set parent to mattype.parent
    if children.exists():
        for child in children:
            child.forelder = mattype.forelder
            child.save()
            impacted_materials.append(MaterialTypeSerializer(child).data)
    
    # Transfer existing reportmaterials
    reportmaterials = rapportmateriale.objects.filter(materiale=mattype)

    for reportmaterial in reportmaterials:
        # parent material for same report
        parent_reportmaterial = rapportmateriale.objects.filter(rapport=reportmaterial.rapport, materiale=mattype.forelder)
        if parent_reportmaterial.exists():
            parent_reportmaterial = parent_reportmaterial.first()

            # add submaterial amounts to existing amounts
            parent_reportmaterial.mengdetilanlegg += reportmaterial.mengdetilanlegg
            parent_reportmaterial.mengdetilgjenbruk += reportmaterial.mengdetilgjenbruk
            parent_reportmaterial.planlagtmengde += reportmaterial.planlagtmengde
            parent_reportmaterial.faktiskmengde += reportmaterial.faktiskmengde
            parent_reportmaterial.totalmengde += reportmaterial.totalmengde
            parent_reportmaterial.save()
        else:
            # create new reportmaterial with parent
            new_reportmaterial = rapportmateriale(
                rapport=reportmaterial.rapport,
                materiale=mattype.forelder,
                planlagtmengde=reportmaterial.planlagtmengde,
                faktiskmengde=reportmaterial.faktiskmengde,
                mengdetilgjenbruk=reportmaterial.mengdetilgjenbruk,
                mengdetilanlegg=reportmaterial.mengdetilanlegg,
                anlegg=reportmaterial.anlegg,
                totalmengde=reportmaterial.totalmengde
                
            )
            new_reportmaterial.save()
        
        # delete old
        reportmaterial.delete()

    mattype.delete()

    return Response(impacted_materials, status=200)