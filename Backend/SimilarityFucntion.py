import polars as pl
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


def similarity(building:list, report:list) -> float:
    score = 0
    #Comapares bulding codes
    building_code = str(building[1])
    report_code = str(report[1])
    if(building_code[0] == report_code[0]):
        if(building_code[1] == report_code[1]):
            if(building_code[2] == report_code[2]):
                score += 1
            else:
                score += 0.7
        else:
            score += 0.3
    #Compares number of livable units
    score += 1 - abs(building[2]-report[2])/max(building[2],report[2])
    #Compares livable area
    score += 1 - abs(building[3]-report[3])/max(building[3],report[3])
    #Computes euclidian distance between cordinates and normalises againts highest known value
    score += 1 - math.sqrt((building[5][0]-report[5][0])**2+(building[5][1]-report[5][1])**2)/5
    #Compares build year
    if abs(building[6]-report[6]) < 26:
        score += 1 - abs(building[6]-report[6])/25
    return score



def recalibrateDatabase(builidngs:pl.DataFrame, reports:pl.DataFrame):
    computation_building = builidngs.rows()
    computation_reports = reports.rows()
    total_scores = []
    for i in computation_building:
        best_scores = []
        for j in computation_reports:
            score = similarity(i,j)
            if len(best_scores) < 6:
                best_scores.append((score,j[0]))
            else:
                best_scores.append((score,j[0]))
                best_scores.remove(min(best_scores, key=lambda p:p[0]))
        total_scores.append(best_scores)