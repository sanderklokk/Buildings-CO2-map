import os
import time
import pprint
from django.core.management.base import BaseCommand, CommandError
import json
import polars
from App.models import *

class Command(BaseCommand):
    def createDf(self) -> polars.DataFrame:
        with open('../Data/data14.json', 'r') as file14, open('../Data/data15.json', 'r') as file15:
            data14 = json.load(file14)
            data15 = json.load(file15)

        df14 = polars.json_normalize(data14['features']).drop(["type", "geometry.type"])
        df15 = polars.json_normalize(data15['features']).drop("type")

        df = df14.join(other=df15, on="properties.bygningsnr", how="inner")

        return df

   