import math
from App import models
import json




def similarity(building_id:int, report_id:int) -> float:
    score = 0
    report = models.rapport.objects.filter(id = report_id)[0]
    building = models.Bygning.objects.filter(byggningsnr = building_id)[0]
    report_building = models.Bygning.objects.filter(byggningsnr = report.bygning)[0]
    building_info = models.Byggningsinfo.objects.filter(bygning = building)[0]
    report_building_info = models.Byggningsinfo.objects.filter(bygning = report_building)[0]
    #Comapares bulding codes
    building_code = str(building_info.byggningstypekode)
    report_code = str(report_building_info.byggningstypekode)
    if(building_code[0] == report_code[0]):
        if(building_code[1] == report_code[1]):
            if(building_code[2] == report_code[2]):
                score += 2
            else:
                score += 1.4
        else:
            score += 1
    #Compares number of livable units
    score += 1 - abs(building_info.antallboenheter-report_building_info.antallboenheter)/max(building_info.antallboenheter,report_building_info.antallboenheter)
    #Compares livable area
    score += 1 - abs(building_info.bruksarealtotalt-report_building_info.bruksarealtotalt)/max(building_info.bruksarealtotalt,report_building_info.bruksarealtotalt)
    #Computes euclidian distance between cordinates and normalises againts highest known value
    building_cordinate = models.Koordinater.objects.filter(bygning = building)[0]
    report_cordinate = models.Koordinater.objects.filter(bygning = report_building)[0]
    score += 1 - math.sqrt((building_cordinate.longitude-report_cordinate.longitude)**2+(building_cordinate.latitude-report_cordinate.latitude)**2)/5
    
    #Compares build year
    if abs(building.byggdato-report_building.byggdato) < 26:
        score += (1 - abs(building.byggdato-report_building.byggdato)/25)*2
    return score



def recalibrateDatabase():
    for i in models.Bygning.objects.all():
        #Saving best score for row
        best_scores = []
        for j in models.rapport.objects.all():
            #Calculating how close the two rows are
            score = similarity(i.byggningsnr,j.id)
            #If we do not ahve enough buildings save everything
            if len(best_scores) < 6:
                best_scores.append((score,j.id))
            #Check if new score is better than saved scores and repdace if better
            else:
                best_scores.append((score,j.id))
                best_scores.remove(min(best_scores, key=lambda p:p["0"]))
        i.naboer = json.dumps(best_scores)
        i.save()
        updateMaterials(i.byggningsnr)

def addOneReport(report_ID:int):
    for i in models.Bygning.objects.all():
        check = json.load(i.naboer)
        new = check.copy()
        new.append(similarity(i.byggningsnr,report_ID))
        new.remove(min(new, key=lambda p:p[0]))
        if new != check:
            i.naboer = new
            i.save()
            updateMaterials(i.byggningsnr)

def addOneHouse(house_ID:str):
    bulding = models.Bygning.objects.filter(id = house_ID)[0]
    reports = models.rapport.objects.all()
    check = json.load(bulding.naboer)
    new = check.copy()
    for i in reports:
        new.append(similarity(bulding.byggningsnr,i.id))
        if len(new) > 5:
            new.remove(min(new, key=lambda p:p[0]))
    updateMaterials(bulding.byggningsnr)

def updateMaterials(bygning:int):
    bulding = models.Bygning.objects.filter(byggningsnr = bygning)[0]
    similar = []
    for tuple in json.load(bulding.naboer):
        score, key = tuple
        similar.append(key)
    sement = 0
    wood = 0
    for i in similar:
        report = models.rapport.objects.filter(id = i)[0]
        report_wood = models.rapportmateriale.objects.filter(rapport = report,materiale = "wood")[0]
        wood += report_wood.totalmengde
        report_sement = models.rapportmateriale.objects.filter(rapport = report,materiale = "semnet")[0]
        sement += report_sement.totalmengde
    sement = sement/len(similar)
    wood = wood/len(similar)
    if models.materialer.objects.filter(bygning = bulding, type_material = "wood").exists:
        update = models.materialer.objects.filter(bygning = bulding, type_material = "wood")[0]
        update.mengde = wood
        update.totalmengde = wood
        update.save()
    else:
        new = models.materialer(bygning = bulding, type_material = "sement", mengde = sement, totalmengde = sement)
        new.save()

    if models.materialer.objects.filter(bygning = bulding, type_material = "sement").exists:
        update = models.materialer.objects.filter(bygning = bulding, type_material = "sement")[0]
        update.mengde = sement
        update.totalmengde = sement
        update.save()
    else:
        new = models.materialer(bygning = bulding, type_material = "sement", mengde = sement, totalmengde = sement)
        new.save()
    
        



