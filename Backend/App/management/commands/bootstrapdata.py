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

        #preprocess df14 
        df14 = polars.json_normalize(data14['features']).drop(["type", "geometry.type"])
        df14 = df14.with_columns(polars.col("properties.dato").str.to_datetime())
        df14 = df14.group_by(["properties.bygningsnr", "properties.bygningstatuskode"]).last() #Discards the oldest building for entries with the same "properties.bygningskode"
        df14 = df14.filter(polars.col("properties.bygningstatuskode") == "TB")

        df15 = polars.json_normalize(data15['features']).drop("type")

        # df = df14.join(other=df15, on="properties.bygningsnr", how="inner")

        return df14, df15

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
        # pprint.pp(self.createDf().columns)
        df14, df15 = self.createDf()
        print(df14)
        # self.populate(self.createDf())
        print("print: " + os.getcwd())
        print("elapsed time: " + str(round(time.time() - st, 3)))
        
