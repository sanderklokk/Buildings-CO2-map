import pandas as pd
import math
from App import models
from django_pandas.io import read_frame


def similarity(building_id:str, report_id:str) -> float:
    score = 0
    report = models.rapport.objects.filter(id = report_id)[0]
    building = models.bygning.objects.filter(bygningid = building_id)[0]
    report_building = models.bygning.objects.filter(bygningid = report.bygning)[0]
    #Comapares bulding codes
    building_code = str(building.bygningstypekode)
    report_code = str(report_building.bygningstypekode)
    if(building_code[0] == report_code[0]):
        if(building_code[1] == report_code[1]):
            if(building_code[2] == report_code[2]):
                score += 2
            else:
                score += 1.4
        else:
            score += 1
    #Compares number of livable units
    score += 1 - abs(building.anntalboenheter-report_building.anntalboenheter)/max(building.anntalboenheter,report_building.anntalboenheter)
    #Compares livable area
    score += 1 - abs(building.bruksarealtotalt-report_building.bruksarealtotalt)/max(building.bruksarealtotalt,report_building.bruksarealtotalt)
    #Computes euclidian distance between cordinates and normalises againts highest known value
    building_cordinate = models.koordinater.objects.filter(bygningid = building.bygnignsnr)
    report_cordinate = models.koordinater.objects.filter(bygningid = report_building.bygning)
    score += 1 - math.sqrt((building_cordinate.x-report_cordinate.x)**2+(building_cordinate.y-report_cordinate.y)**2)/5
    
    #Compares build year
    if abs(building.bygdDato-report_building.bygdDato) < 26:
        score += (1 - abs(building.bygdDato-report_building.bygdDato)/25)*2
    return score



def recalibrateDatabase(buildings:pd.DataFrame, reports:pd.DataFrame) -> pd.DataFrame:
    #Saving scores for database
    total_scores = []
    for i in buildings.iter_rows():
        #Saving best score for row
        best_scores = []
        for j in reports.iter_rows():
            #Calculating how close the two rows are
            score = similarity(i["bygnignsnr"],j["id"])
            #If we do not ahve enough buildings save everything
            if len(best_scores) < 6:
                best_scores.append((score,j["id"]))
            #Check if new score is better than saved scores and repdace if better
            else:
                best_scores.append((score,j["id"]))
                best_scores.remove(min(best_scores, key=lambda p:p["0"]))
        total_scores.append(best_scores)
    buildings["Similarity"]  = total_scores
    for i in buildings.iterrows():
        updateMaterials(i)

# def acceptableRange(neigbhours:list, reports:pd.DataFrame) -> list:
#     range = []
#     zeros = 0
#     density = reports.loc[reports["ID"] == neigbhours]
#     if neigbhours.count(0) > len(list)//2:
#         range.append(0)
#         range.append(np.array(neigbhours).mean()*2)
#     else:
#         range.append(np.array(neigbhours).mean()*0.5)
#         range.append(np.array(neigbhours).mean()*2)
#     return range

def addOneReport(report_ID:str):
    buldings = models.bygning.objects.all()
    reports = models.rapport.objects.filter(id = report_ID)
    df_buldings = read_frame(buldings)
    current_report = read_frame(reports)
    
    for i in df_buldings.iterrows():
        new = i["naboer"].append(similarity(i,current_report),current_report["ID"])
        new.remove(min(new, key=lambda p:p[0]))
        if new != i["naboer"]:
            i["naboer"] = new
            updateMaterials(i)

def addOneHouse(house_ID:str):
    buldings = models.bygning.objects.filter(id = house_ID)
    reports = models.rapport.objects.all()
    current_bulding = read_frame(buldings)
    df_reports = read_frame(reports)
    new = []
    for i in df_reports.iterrows():
        new = current_bulding["naboer"].append(similarity(current_bulding,i),i["ID"])
        if len(new) > 5:
            new.remove(min(new, key=lambda p:p[0]))
    current_bulding["naboer"] = new
    updateMaterials(current_bulding)

def updateMaterials(se_bygning:pd.Series):
    raport_materials = models.rapportmateriale.objects.all()
    materials = models.materialer.objects.all()
    df_raport_materials = read_frame(raport_materials)
    df_materials = read_frame(materials)
    similar = []
    for tuple in se_bygning["naboer"]:
        score, key = tuple
        similar.append(key)
    reports = reports.loc[reports["id"] == similar]
    IDs = list(reports["id"])
    df_raport_materials = df_raport_materials.loc[df_raport_materials["rapport"] == IDs]
    raport_materials_set = set(df_raport_materials["materiale"])
    for material in raport_materials_set:
        if df_materials.loc[df_materials["bygning"] == se_bygning["bygningsnr"] & df_materials["type_materiale"] == material].empty:
            update = models.materialer.objects.filter(bygning = se_bygning["bygningsnr"]).filter(type_material = material)[0]
            update.mengde = df_raport_materials["mengde"].mean()
            update.save()
        else:
            new = models.materialer(bygning= se_bygning["bygningsnr"], type_materale=material,mengde=df_raport_materials.loc[df_raport_materials["materiale"] == material,"mengde"].mean())
            new.save()
    
        



