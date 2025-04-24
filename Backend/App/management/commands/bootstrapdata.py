import time
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
import json
import polars
import datetime
from App.models import *
import SimilarityFucntion

class Command(BaseCommand):
    def createDf(self) -> polars.DataFrame:

        with open('../Data/data14.json', 'r') as file14, open('../Data/data15.json', 'r') as file15:
            data14 = json.load(file14)
            data15 = json.load(file15)

        #read data14 to polars DF
        df14 = polars.json_normalize(data14['features']).drop(["type", "geometry.type", "properties.msid"]) 
        #preprocess df14 
        df14 = df14.with_columns(polars.col("properties.dato").str.to_datetime()) #cast date column to datetime
        df14 = df14.group_by(["properties.bygningsnr", "properties.bygningstatuskode"]).last() #Discards the oldest building for entries with the same "properties.bygningskode"'
        df14 = df14.drop_nulls(subset=["geometry.coordinates"])
        df14 = df14.filter(polars.col("properties.bygningstatuskode") == "TB") #discards rows where bygningsstatuskode != "TB"

        #read data15 to polars DF
        df15 = polars.json_normalize(data15['features']).drop(["type", "properties.msid", "properties.endringstidspunkt"])
        df15 = df15.group_by(["properties.bygningsnr"]).last()
        df15 = df15.filter(polars.col("properties.bygningsnr").is_in(df14["properties.bygningsnr"])) #remove rows with building numbers not in df14
        df14 = df14.filter(polars.col("properties.bygningsnr").is_in(df15["properties.bygningsnr"]))
        return df14, df15

    #TO-DO
    #*Add bulk_create for all tables
    #*Fix/figiure out duplicate
    def populate(self, df14: polars.DataFrame, df15: polars.DataFrame, st):
        print(f"pre-processing:{round(time.time() - st, 3)}")
        ct = time.time()
        Bygning.objects.bulk_create([
            Bygning(
                byggningsnr=row["properties.bygningsnr"],
                bygningstatuskode=row["properties.bygningstatuskode"],
                byggdato=row["properties.dato"].date(), #only save the date (discard time datas)
                naboer = json.dumps([])

            ) for row in df14.iter_rows(named=True)
        ])
        print(f"Bygninger: {round(time.time() - ct, 3)}")
        ct = time.time()

        Koordinater.objects.bulk_create([
            Koordinater(
                bygning=Bygning.objects.get(byggningsnr=row["properties.bygningsnr"]),
                latitude=row["geometry.coordinates"][0],
                longitude=row["geometry.coordinates"][1]
            ) for row in df14.iter_rows(named=True) if row["geometry.coordinates"] != None
        ])
        print(f"Coordinates: {round(time.time() - ct, 3)}")
        ct = time.time()

        Byggningsinfo.objects.bulk_create([
            Byggningsinfo(
                antallboenheter=row["properties.antallboenheter"],
                antalletasjer=row["properties.antalletasjer"],
                bebygdareal=row["properties.bebygdareal"],
                bruksarealannet=row["properties.bruksarealannet"],
                bruksarealbolig=row["properties.bruksarealbolig"],
                bruksarealtotalt=row["properties.bruksarealtotalt"],
                byggningstypekode=row["properties.bygningstypekode"],
                bygning=Bygning.objects.get(byggningsnr=row["properties.bygningsnr"]),
                bygningstatuskode=row["properties.bygningstatuskode"],
                kommuneId=row["properties.kommune"],
                tilbyggsnr=row["properties.tilbyggsnr"]
            ) for row in df15.iter_rows(named=True)
        ])

        print(f"Bygginfo: {round(time.time() - ct, 3)}")


    def populate_reports(self,st):
        with open("../Data/Reports.csv",'r', encoding="utf8") as file:
            reporthouses = polars.read_csv(file,has_header=True)
        ct = time.time()
        Bygning.objects.bulk_create([
            Bygning(
                byggningsnr=row["properties.bygningsnr"],
                bygningstatuskode=row["properties.bygningstatuskode"],
                byggdato=datetime.datetime(row["properties.dato"],1,1), #only save the date (discard time datas)
                naboer = json.dumps([])

            ) for row in reporthouses.iter_rows(named=True)
        ])
        print(f"Bygninger: {round(time.time() - ct, 3)}")
        ct = time.time()

        Koordinater.objects.bulk_create([
            Koordinater(
                bygning=Bygning.objects.get(byggningsnr=row["properties.bygningsnr"]),
                latitude=row["coordinates0"],
                longitude=row["coordinates1"]
            ) for row in reporthouses.iter_rows(named=True) if row["coordinates0"] != None
        ])

        print(f"Coordinates: {round(time.time() - ct, 3)}")
        ct = time.time()

        Byggningsinfo.objects.bulk_create([
            Byggningsinfo(
                antallboenheter=row["properties.antallboenheter"],
                antalletasjer=0,
                bebygdareal=0,
                bruksarealannet=0,
                bruksarealbolig=row["properties.bruksarealbolig"],
                bruksarealtotalt=row["properties.bruksarealtotalt"],
                byggningstypekode=row["properties.bygningstypekode"],
                bygning=Bygning.objects.get(byggningsnr=row["properties.bygningsnr"]),
                bygningstatuskode=row["properties.bygningstatuskode"],
                kommuneId=0,
                tilbyggsnr=row["properties.tilbyggsnr"]
            ) for row in reporthouses.iter_rows(named=True)
        ])

        print(f"Bygginfo: {round(time.time() - ct, 3)}")

        tang = materialtype(
            navn = "trevirke"
        )
        tang.save()
        tang = materialtype(
            navn = "sement"
        )
        tang.save()

        for row in reporthouses.iter_rows(named=True):
            ting = rapport(
                bygning = Bygning.objects.get(byggningsnr=row["properties.bygningsnr"]),
                postalcode = 0,
                berortbra = 0
                )
            ting.save
            trevirke = rapportmateriale(
                rapport= ting,
                materiale=materialtype.objects.get(navn = "trevirke"),
                faktiskmengde = row["trevirke"],
                mengdeperm2 = row["trevirke"]/row["properties.bruksarealtotalt"],
                totalmengde = row["trevirke"],

                planlagtmengde = 0,
                mengdetilgjenbruk = 0,
                mengdetilanlegg = 0,
                anlegg = ""
            )
        
            sement = rapportmateriale(
                rapport=ting,
                materiale=materialtype.objects.get(navn = "sement"),
                faktiskmengde = row["sement"],
                mengdeperm2 = row["sement"]/row["properties.bruksarealtotalt"],
                totalmengde = row["sement"],

                planlagtmengde = 0,
                mengdetilgjenbruk = 0,
                mengdetilanlegg = 0,
                anlegg = ""
            )
            ting.save()
            trevirke.save()
            sement.save()

        print(f"Materialer: {round(time.time() - ct, 3)}")

    def handle(self, *args, **options):
        st = time.time()
        call_command("flush") #remove existing data

        df14, df15 = self.createDf()
        self.populate(df14, df15, st)
        self.populate_reports(st)
        SimilarityFucntion.recalibrateDatabase()

        print(f"elapsed time: {round(time.time() - st, 3)}")
        
