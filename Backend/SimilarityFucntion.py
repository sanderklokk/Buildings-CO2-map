import polars as pl
import numpy as np
import math

def readData(building_path:str, raports_path:str) -> pl.DataFrame:
    building = pl.read_csv(building_path)
    #building = building.with_columns(pl.col("properties.dato").str.slice(0,length=4).str.to_integer())
    #building = building.with_columns(pl.col("geometry.coordinates").str.json_decode().alias("geometry.coordinates"))
    #building = building.drop_nulls("geometry.coordinates")

    reports = pl.read_csv(raports_path)
    #reports = reports.with_columns(pl.col("properties.dato").str.slice(0,length=4).str.to_integer())
    #reports = reports.with_columns(pl.col("geometry.coordinates").str.json_decode().alias("geometry.coordinates"))
    return building, reports

#computation_building = building.drop(["properties.bygningsnr","properties.tilbyggsnr","properties.bygningstatuskode"]).rows()
#computation_reports = reports.drop(["properties.bygningsnr","properties.tilbyggsnr","properties.bygningstatuskode"]).rows()


def similarity(building:pl.Series, report:pl.Series) -> float:
    score = 0
    #Comapares bulding codes
    building_code = str(building["properties.bygningstypekode"])
    report_code = str(report["properties.bygningstypekode"])
    if(building_code[0] == report_code[0]):
        if(building_code[1] == report_code[1]):
            if(building_code[2] == report_code[2]):
                score += 2
            else:
                score += 1.4
        else:
            score += 1
    #Compares number of livable units
    score += 1 - abs(building["properties.antallboenheter"]-report["properties.antallboenheter"])/max(building["properties.antallboenheter"],report["properties.antallboenheter"])
    #Compares livable area
    score += 1 - abs(building["properties.bruksarealtotalt"]-report["properties.bruksarealtotalt"])/max(building["properties.bruksarealtotalt"],report["properties.bruksarealtotalt"])
    #Computes euclidian distance between cordinates and normalises againts highest known value
    score += 1 - math.sqrt((building["geometry.coordinates"][0]-report["geometry.coordinates"][0])**2+(building["geometry.coordinates"][1]-report["geometry.coordinates"][1])**2)/5
    #Compares build year
    if abs(building["properties.dato"]-report["properties.dato"]) < 26:
        score += (1 - abs(building["properties.dato"]-report["properties.dato"])/25)*2
    return score



def recalibrateDatabase(buildings:pl.DataFrame, reports:pl.DataFrame):
    #Saving scores for database
    total_scores = []
    for i in buildings.iter_rows():
        #Saving best score for row
        best_scores = []
        for j in reports.iter_rows():
            #Calculating how close the two rows are
            score = similarity(i,j)
            #If we do not ahve enough buildings save everything
            if len(best_scores) < 6:
                best_scores.append((score,j[0]))
            #Check if new score is better than saved scores and replace if better
            else:
                best_scores.append((score,j[0]))
                best_scores.remove(min(best_scores, key=lambda p:p[0]))
        total_scores.append(best_scores)

def acceptableRange(neigbhours:list, material:str, reports:pl.DataFrame):
    range = []
    zeros = 0
    if neigbhours.count(0) > len(list)//2:
        range.append(0)
        range.append(np.array(neigbhours).mean()*1.2)
    else:
        range.append(np.array(neigbhours).mean()*0.8)
        range.append(np.array(neigbhours).mean()*1.2)
    return range