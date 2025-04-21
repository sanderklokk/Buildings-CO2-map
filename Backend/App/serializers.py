from rest_framework import serializers
from .models import materialtype, rapport, rapportmateriale, bygning

# DTO Models
class WasteReportMaterialDTOSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    materiale = serializers.IntegerField()
    planlagtmengde = serializers.FloatField()
    faktiskmengde = serializers.FloatField()
    mengdetilgjenbruk = serializers.FloatField()
    mengdetilanlegg = serializers.FloatField()
    anlegg = serializers.CharField()
    totalmengde = serializers.FloatField()

class WasteReportDTOSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    bygning = serializers.IntegerField(required=False, allow_null=True)
    dato = serializers.CharField(required=False, allow_null=True)
    address = serializers.CharField()
    postalcode = serializers.IntegerField()
    postalplace = serializers.CharField()
    berortbra = serializers.IntegerField()
    bygningstype = serializers.CharField()
    konstruksjonstype = serializers.CharField()
    handtering = serializers.CharField()
    type = serializers.CharField()
    materialer = WasteReportMaterialDTOSerializer(many=True)


# DB MODELS
class RapportMaterialeSerializer(serializers.ModelSerializer):
    class Meta:
        model = rapportmateriale
        fields = '__all__'
    
class RapportSerializer(serializers.ModelSerializer):
    class Meta:
        model = rapport
        fields = '__all__'

class MaterialTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = materialtype
        fields = '__all__'

class MaterialerSerializer(serializers.ModelSerializer):
    class Meta:
        model = materialtype
        fields = '__all__'

class BygningSerializer(serializers.ModelSerializer):
    class Meta:
        model = bygning
        fields = '__all__'

