import os
import time
import pprint
from django.core.management.base import BaseCommand, CommandError
import json
import polars
from App.models import *
from datetime import datetime

class Command(BaseCommand):
    def createDf(self) -> polars.DataFrame:

        with open('../Data/data14.json', 'r') as file14, open('../Data/data15.json', 'r') as file15:
            data14 = json.load(file14)
            data15 = json.load(file15)


        #read data14 to polars DF
        df14 = polars.json_normalize(data14['features']).drop(["type", "geometry.type"]) 

        #preprocess df14 
        df14 = df14.with_columns(polars.col("properties.dato").str.to_datetime()) #cast date column to datetime

        df14 = df14.group_by(["properties.bygningsnr", "properties.bygningstatuskode"]).last() #Discards the oldest building for entries with the same "properties.bygningskode"
        
        df14 = df14.filter(polars.col("properties.bygningstatuskode") == "TB") #discards rows where bygningsstatuskode != "TB"
        
        #read data15 to polars DF
        df15 = polars.json_normalize(data15['features']).drop("type")

        # filter away buldings thats not the "main building" (makes sure there is only one building per bygningsnr)
        df15 = df15.filter(polars.col("properties.tilbyggsnr").is_null())

        return df14, df15

    def populate(self, df: polars.DataFrame, df2: polars.DataFrame):

        # create dict with bygningid -> data from df14
        df14data = {}
        for row in df2.iter_rows(named=True):
            # (for now) skip rows with missing data
            if row["geometry.coordinates"] == None:
                continue

            df14data[row["properties.bygningsnr"]] = {
                "dato": row["properties.dato"],
                "lat": row["geometry.coordinates"][0],
                "lon": row["geometry.coordinates"][1],
            }

        # create all new instances of building and coordinates
        coordinates = []
        buildings = []
        for row in df.iter_rows(named=True):
            # (for now) skip rows with missing data
            dato = df14data.get(row["properties.bygningsnr"], {}).get("dato", None)
            if dato is None:
                continue
         
            b = bygning(
                    bygnignsnr=row["properties.bygningsnr"],
                    bygningsstatuskode=row["properties.bygningstatuskode"],
                    bygdDato=dato,
                    anntalboenheter=row["properties.antallboenheter"],
                    antalletasjer=row["properties.antalletasjer"],
                    bebygdareal=row["properties.bebygdareal"],
                    bruksarealannet=row["properties.bruksarealannet"],
                    bruksarealbolig=row["properties.bruksarealbolig"],
                    bruksarealtotalt=row["properties.bruksarealtotalt"],
                    bygningstypekode=row["properties.bygningstypekode"],
                    kommune=row["properties.kommune"]
                )
            buildings.append(b)
            coordinates.append(koordinater(bygningid=b, x=df14data[row["properties.bygningsnr"]]["lat"], y=df14data[row["properties.bygningsnr"]]["lon"]))

        # save instances
        bygning.objects.bulk_create(buildings)
        print("added: " + str(len(buildings)) + " buildings")
        koordinater.objects.bulk_create(coordinates)
        print("added: " + str(len(coordinates)) + " coordinates")



    def handle(self, *args, **options):
        st = time.time()
        self.stdout.write(os.getcwd())
        df14, df15 = self.createDf()

        self.populate(df15, df14)
        print("print: " + os.getcwd())
        print("elapsed time: " + str(round(time.time() - st, 3)))
        
