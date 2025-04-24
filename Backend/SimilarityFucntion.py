import math
from App import models
import json
import time

dictkoords = {}
dictbygning = {}
dictbygginfo = {}
dictnaboer = {}
dictrapport = {}
dictrapportmateriale = {}
dictmaterialtyper = {}

newmaterials = []

# calculate similarity score between two buildings
def similarity(building_id:int, report_id:int) -> float:
    score = 0
    report = dictrapport[str(report_id)] #models.rapport.objects.get(id = report_id)
    building = dictbygning[str(building_id)] # models.Bygning.objects.get(byggningsnr = building_id)
    report_building = dictbygning[str(report.bygning.byggningsnr)] # models.Bygning.objects.get(byggningsnr = report.bygning.byggningsnr)
    building_info =  dictbygginfo[str(building_id)] # models.Byggningsinfo.objects.get(bygning = building_id)
    report_building_info =  dictbygginfo[str(report.bygning.byggningsnr)] # models.Byggningsinfo.objects.get(bygning = report_building.byggningsnr)

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

    building_cordinate = dictkoords[str(report_building.byggningsnr)] 
    
  
    report_cordinate = dictkoords[str(report_building.byggningsnr)] 

    score += 1 - math.sqrt((building_cordinate.longitude-report_cordinate.longitude)**2+(building_cordinate.latitude-report_cordinate.latitude)**2)/5

    #Compares build year
    bulding_date = int(str(building.byggdato)[:4])
    report_date = int(str(report_building.byggdato)[:4])
    if abs(bulding_date-report_date) < 26:
        score += (1 - abs(bulding_date-report_date)/25)*2
    return score



def recalibrateDatabase():
    global dictkoords
    global newmaterials
    print("recalibrating database")
    print("Loading koordinater")
    koordinates_data = models.Koordinater.objects.all()
    for i in koordinates_data:
        dictkoords[str(i.bygning.byggningsnr)] = i
    global dictbygginfo
    print("Loading building info")
    building_info_data = models.Byggningsinfo.objects.all()
    for i in building_info_data:
        dictbygginfo[str(i.bygning.byggningsnr)] = i
    global dictbygning
    print("Loading building data")  
    building_data = models.Bygning.objects.all()
    
    for i in building_data:
        dictbygning[str(i.byggningsnr)] = i

    global dictnaboer
    dictnaboer = {}
    for i in building_data:
        dictnaboer[str(i.byggningsnr)] = i.naboer

  
    global dictrapport
    dictrapport = {}  
    rapport_data = models.rapport.objects.all()
    for i in rapport_data:
        dictrapport[str(i.id)] = i

    global dictrapportmateriale
    dictrapportmateriale = {}
    rapport_materiale_data = models.rapportmateriale.objects.all()
    for i in rapport_materiale_data:
        dictrapportmateriale[f'{i.rapport.id},{i.materiale.id}'] = i

    global dictmaterialtyper
    materialtyper_data = models.materialtype.objects.all()
    for i in materialtyper_data:
        dictmaterialtyper[str(i.id)] = i

    print("starting calibration")

    count = 0
    
    t = time.time()
    for i in building_data:
        count += 1
        if count % 200 == 0:
            print(f'count: {count}')
            print(f'time: {time.time()-t}')
        
        if len(newmaterials) > 5000:
            bulk_create_update()
            newmaterials = []
        
        #Saving best score for row
        best_scores = []
        for j in rapport_data:

         
            #Calculating how close the two rows are

            score = similarity(i.byggningsnr,j.id)
            #If we do not ahve enough buildings save everything
            if len(best_scores) < 6:
                best_scores.append((score,j.id))
            #Check if new score is better than saved scores and repdace if better
            else:
                best_scores.append((score,j.id))
                best_scores.remove(min(best_scores, key=lambda p:p[0]))
      
        
        dictnaboer[str(i.byggningsnr)] = best_scores
        updateMaterials(i.byggningsnr)
        
        #print(time.time()-tt)
    
    if len(newmaterials) > 0:
        bulk_create_update()
        newmaterials = []
        

# update materials for a building
def updateMaterials(bygning:int):
    global dictbygning
    global dictmaterialtyper

    global newmaterials

    #bulding =  models.Bygning.objects.get(byggningsnr = bygning)

    bulding = dictbygning[str(bygning)] 
   

    bulding_info = dictbygginfo[str(bygning)]    #models.Byggningsinfo.objects.get(bygning = bulding.byggningsnr)
    similar = []
    for tuple in dictnaboer[str(bulding.byggningsnr)]:
        score, key = tuple
        similar.append(key)
   # trevirke = dictmaterialtyper["trevirke"] # models.materialtype.objects.get(navn = "trevirke")
   # trevirke_id = trevirke.id
  ##  sement = dictmaterialtyper["sement"] # models.materialtype.objects.get(navn = "sement")
   # sement_id = sement.id
   # sement = 0
   # trevirke = 0

    for material in dictmaterialtyper.values():
        materialamount = 0
        for i in similar:
            material_id = material.id
            report = dictrapport[str(i)] #models.rapport.objects.get(id = i)
            report_material = dictrapportmateriale.get(f'{report.id},{material_id}', -1) #models.rapportmateriale.objects.get(rapport = report,materiale = trevirke_id)
            if report_material == -1:
                continue
            try:
                materialamount += report_material.mengdeperm2
            except:
                # 0 division error etc
                pass
            #report_sement = dictrapportmateriale[f'{report.id},{sement_id}'] #models.rapportmateriale.objects.get(rapport = report,materiale = sement_id)
            #sement += report_sement.totalmengde/report_sement.faktiskmengde
        
       #sement = sement/len(similar)
        try:
            materialamount = materialamount/len(similar)
        except:
            materialamount = 0
      #  try:
      #      update = models.materialer.objects.get(bygning = bulding,type_materiale = models.materialtype.objects.get(navn = materialname))
      #      update.mengde = materialamount
      #      update.totalmengde = materialamount*bulding_info.bruksarealtotalt
      #      update.save()
      #  except:
        newmaterials.append(models.materialer(bygning = bulding, type_materiale = material, mengdeperm2= materialamount , mengde = materialamount*bulding_info.bruksarealtotalt, totalmengde = materialamount*bulding_info.bruksarealtotalt))
           # new.save()

#        try:
 #           update = models.materialer.objects.get(bygning = bulding, type_materiale = models.materialtype.objects.get(navn = "sement"))
  #          update.mengde = sement
   #         update.totalmengde = sement*bulding_info.bruksarealtotalt
    #        update.save()
    #    except:
    #        new = models.materialer(bygning = bulding, type_materiale = models.materialtype.objects.get(navn = "sement"), mengde = 90, totalmengde = sement*bulding_info.bruksarealtotalt)
    #        new.save()
        
            
def bulk_create_update():
    global newmaterials
    models.materialer.objects.bulk_create(
        newmaterials,
        update_conflicts=["mengdeperm2","mengde", "totalmengde"],
        unique_fields=["bygning", "type_materiale"],
        update_fields=["mengde", "totalmengde"],
    )



