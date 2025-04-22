from rest_framework import serializers
from .models import materialtype, rapport, rapportmateriale, Koordinater

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

# Db to fronten map
class buildingMaterialSerializer(serializers.Serializer):
    # id = serializers.IntegerField(required=False, allow_null=True)
    building = serializers.IntegerField(required=True, allow_null=False)
    totalamount = serializers.IntegerField(required = True, allow_null = True)
    latitude = serializers.FloatField(required = True, allow_null = False)
    longitude = serializers.FloatField(required = True, allow_null = False)
    
class singleByggSerializer(serializers.Serializer):
    byggningsnr = serializers.IntegerField(required=True, allow_null=False)
    bygningstatuskode = serializers.CharField(max_length=5)
    kommuneId = serializers.IntegerField()
    byggningstypekode = serializers.IntegerField()
    antallboenheter = serializers.IntegerField()
    antalletasjer = serializers.IntegerField()
    bebygdareal = serializers.IntegerField()
    bruksarealtotalt = serializers.IntegerField()
    bruksarealbolig = serializers.IntegerField()
    bruksarealannet = serializers.IntegerField()
    bygdDato = serializers.DateField()

# class allMaterialTypeAndNameSerializer(serializers.Serializer):
#     navn = serializers.CharField(required=True, allow_null=False)
#     id = serializers.IntegerField(required=True, allow_null=False)
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
class KoordinaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Koordinater
        fields = '__all__'

class MaterialerSerializer(serializers.ModelSerializer):
    class Meta:
        model = rapportmateriale
        fields = '__all__'