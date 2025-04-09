# VIEWS / API Endpoints related to map queries

from django.shortcuts import render
from rest_framework.decorators import api_view
from ..serializers import BygningSerializer
from ..models import materialtype, rapport, rapportmateriale
from rest_framework.response import Response
from django.core.paginator import Paginator 




# returns bulding closest to provided coordinates
@api_view(['GET'])
def get_buildingdata(request):
    longitude = request.GET.get('lat', 0)
    latitude = request.GET.get('lon', 0)
    if longitude == 0 or latitude == 0:
        return Response({"error": "Missing parameters"}, status=400)

    # temporary
    return Response(
        {
            "lon": longitude,
            "lat": latitude,
            "bygningsnr": 123456,
            "bygningsstatuskode": "O",
            "kommune": 1000,
            "bygningstypekode": 33,
            "anntalboenheter": 2,
            "antalletasjer": 3,
            "bebygdareal": 120,
            "bruksarealtotalt": 20,
            "bruksarealbolig": 20,
            "bruksarealannet": 20,
            "bygdDato": "2025-01-01",
            "materialer": [
                {
                    "navn": "Metall",
                    "id": "asadsd-dfdf",
                    "mengde": 123,
                    "totalmengde": 123,
                },
                {
                    "navn": "Betong",
                    "id": "asadsd-dkkfdf",
                    "mengde": 123,
                    "totalmengde": 123,
                    },    
            ]     
        }
    )


    return 
    # return buildingserialzer........find closest
