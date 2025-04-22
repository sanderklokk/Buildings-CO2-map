import math
from App import models
import json

def similarity(building_id:int, report_id:int) -> float:
    score = 0
    report = models.rapport.objects.get(id = report_id)
    report_building = models.Bygning.objects.get(byggningsnr = report.bygning.byggningsnr)
    building_info = models.Byggningsinfo.objects.get(bygning = building.byggningsnr)
    report_building_info = models.Byggningsinfo.objects.get(bygning = report_building.byggningsnr)
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
    building_cordinate = models.Koordinater.objects.get(bygning = building.byggningsnr)
    report_cordinate = models.Koordinater.objects.get(bygning = report_building.byggningsnr)
    score += 1 - math.sqrt((building_cordinate.longitude-report_cordinate.longitude)**2+(building_cordinate.latitude-report_cordinate.latitude)**2)/5
    
    #Compares build year
    bulding_date = int(str(building.byggdato)[:4])
    report_date = int(str(report_building.byggdato)[:4])
    if abs(bulding_date-report_date) < 26:
        score += (1 - abs(bulding_date-report_date)/25)*2
    return score



def recalibrateDatabase():
    for i in models.Bygning.objects.all():
        #Saving best score for row
        best_scores = []
        for j in models.rapport.objects.all():
            building = models.Bygning.objects.get(byggningsnr = j.id)
            #Calculating how close the two rows are
            score = similarity(i.byggningsnr,j.id)
            #If we do not ahve enough buildings save everything
            if len(best_scores) < 6:
                best_scores.append((score,j.id))
            #Check if new score is better than saved scores and repdace if better
            else:
                best_scores.append((score,j.id))
                best_scores.remove(min(best_scores, key=lambda p:p[0]))
        i.naboer = json.dumps(best_scores)
        i.save()
        updateMaterials(i.byggningsnr)

def addOneReport(report_ID:int):
    for i in models.Bygning.objects.all():
        check = json.loads(i.naboer)
        new = check.copy()
        new.append(similarity(i.byggningsnr,report_ID))
        new.remove(min(new, key=lambda p:p[0]))
        if new != check:
            i.naboer = new
            i.save()
            updateMaterials(i.byggningsnr)

def addOneHouse(house_ID:str):
    bulding = models.Bygning.objects.get(id = house_ID)
    reports = models.rapport.objects.all()
    new = []
    for i in reports:
        new.append(similarity(bulding.byggningsnr,i.id))
        if len(new) > 5:
            new.remove(min(new, key=lambda p:p[0]))
    bulding.naboer = json.dump(new)
    updateMaterials(bulding.byggningsnr)

def updateMaterials(bygning:int):
    bulding = models.Bygning.objects.get(byggningsnr = bygning)
    bulding_info = models.Byggningsinfo.objects.get(bygning = bulding.byggningsnr)
    similar = []
    for tuple in json.loads(bulding.naboer):
        score, key = tuple
        similar.append(key)
    trevirke = models.materialtype.objects.get(navn = "trevirke")
    trevirke_id = trevirke.id
    sement = models.materialtype.objects.get(navn = "sement")
    sement_id = sement.id
    sement = 0
    trevirke = 0
    for i in similar:
        report = models.rapport.objects.get(id = i)
        report_trevirke = models.rapportmateriale.objects.get(rapport = report,materiale = trevirke_id)
        trevirke += report_trevirke.totalmengde/report_trevirke.faktiskmengde
        report_sement = models.rapportmateriale.objects.get(rapport = report,materiale = sement_id)
        sement += report_sement.totalmengde/report_sement.faktiskmengde
    sement = sement/len(similar)
    trevirke = trevirke/len(similar)
    try:
        update = models.materialer.objects.get(bygning = bulding,type_materiale = models.materialtype.objects.get(navn = "trevirke"))
        update.mengde = trevirke
        update.totalmengde = trevirke*bulding_info.bruksarealtotalt
        update.save()
    except:
        new = models.materialer(bygning = bulding, type_materiale = models.materialtype.objects.get(navn = "trevirke"), mengde = 89, totalmengde = trevirke*bulding_info.bruksarealtotalt)
        new.save()

    try:
        update = models.materialer.objects.get(bygning = bulding, type_materiale = models.materialtype.objects.get(navn = "sement"))
        update.mengde = sement
        update.totalmengde = sement*bulding_info.bruksarealtotalt
        update.save()
    except:
        new = models.materialer(bygning = bulding, type_materiale = models.materialtype.objects.get(navn = "sement"), mengde = 90, totalmengde = sement*bulding_info.bruksarealtotalt)
        new.save()
    
        



