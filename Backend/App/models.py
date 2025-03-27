from django.db import models

# Create your models here.

class bygning(models.Model):
    bygnignsnr = models.IntegerField(primary_key=True)
    bygningsstatuskode = models.CharField(max_length=5)
    kommune = models.IntegerField()
    bygningstypekode = models.IntegerField()
    anntalboenheter = models.IntegerField()
    antalletasjer = models.IntegerField()
    bebygdareal = models.IntegerField()
    bruksarealtotalt = models.IntegerField()
    bruksarealbolig = models.IntegerField()
    bruksarealannet = models.IntegerField()
    bygdDato = models.DateField()

class materialtype(models.Model):
    id = models.AutoField(primary_key=True)
    navn = models.CharField(max_length=100)
    forelder = models.ForeignKey("self", on_delete=models.CASCADE, null=True)
    farlig = models.BooleanField(default=False)

class koordinater(models.Model):
    bygningid = models.ForeignKey(bygning, on_delete = models.CASCADE, primary_key=True) 
    x = models.FloatField()
    y = models.FloatField()

class materialer(models.Model): #bygningsrelasjon?
    bygning = models.ForeignKey(bygning, on_delete=models.CASCADE, primary_key=True) 
    type_materiale = models.ForeignKey(materialtype, on_delete=models.CASCADE)
    mengde = models.IntegerField()
    totalmengde = models.IntegerField()



# class rapport(models.Model):
#     dato = models.DateField()
#     bygning = models.ForeignKey(bygning, on_delete=models.CASCADE)
#     materialerroot = models.ForeignKey(materialer, on_delete=models.CASCADE)

class rapport(models.Model):
    id = models.AutoField(primary_key=True)
    # Null=True temporary
    bygning = models.ForeignKey(bygning, on_delete=models.CASCADE, null=True)

    dato = models.DateField(auto_now_add=True, null=True)
    address = models.CharField(max_length=100)
    postalcode = models.IntegerField()
    postalplace = models.CharField(max_length=100)
    berortbra = models.IntegerField()
    bygningstype = models.CharField(max_length=100)
    konstruksjonstype = models.CharField(max_length=100)
    handtering = models.CharField(max_length=300)
    type = models.CharField(max_length=100)

class rapportmateriale(models.Model):
    rapport = models.ForeignKey(rapport, on_delete=models.CASCADE)
    materiale = models.ForeignKey(materialtype, on_delete=models.CASCADE)
    planlagtmengde = models.IntegerField()
    faktiskmengde = models.IntegerField()
    mengdetilgjenbruk = models.IntegerField()
    mengdetilanlegg = models.IntegerField()
    anlegg = models.CharField(max_length=100)
    totalmengde = models.IntegerField()