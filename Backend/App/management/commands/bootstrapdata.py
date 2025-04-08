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

    #TO-DO
    #*Add bulk_create for all tables
    #*Fix/figiure out duplicate
    def populate(self, df: polars.DataFrame):
        bygning.objects.bulk_create([
            bygning(
                bygnignsnr=row["properties.bygningsnr"],
                bygningsstatuskode=row["properties.bygningstatuskode"],
                bygdDato=row["properties.dato"].split('T', maxsplit = 1)[0],
                anntalboenheter=row["properties.antallboenheter"],
                antalletasjer=row["properties.antalletasjer"],
                bebygdareal=row["properties.bebygdareal"],
                bruksarealannet=row["properties.bruksarealannet"],
                bruksarealbolig=row["properties.bruksarealbolig"],
                bruksarealtotalt=row["properties.bruksarealtotalt"],
                bygningstypekode=row["properties.bygningstypekode"],
                kommune=row["properties.kommune"]

            ) for row in df.iter_rows(named=True)
        ])

    def handle(self, *args, **options):
        st = time.time()
        self.stdout.write(os.getcwd())
        pprint.pp(self.createDf().columns)
        self.populate(self.createDf())
        print("print: " + os.getcwd())
        print("elapsed time: " + str(round(time.time() - st, 3)))
        
