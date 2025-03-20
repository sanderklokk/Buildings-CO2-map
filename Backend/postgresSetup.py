from django.db import models


class bygning(models.Model):
    bygnignsnr = models.IntegerField()
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

class coordinates(models.Model):
    bygningid = models.ForeignKey(bygning, on_delete = models.CASCADE)
    x = models.FloatField()
    y = models.FloatField()

class materialer():
    forelder = models.ForeignKey("self", on_delete=models.CASCADE)
    bygning = models.ForeignKey(bygning, on_delete=models.CASCADE)
    mengde = models.IntegerField()
    totalmengde = models.IntegerField()

class rapport():
    dato = models.DateField()
    bygning = models.ForeignKey(bygning, on_delete=models.CASCADE)
    materialerroot = models.ForeignKey(materialer, on_delete=models.CASCADE)

# class rapportmateriale:
#     rapport = models.ForeignKey(rapport, on_delete=models.CASCADE)
#     materiale = models.ForeignKey(materiale, on_delete=models.CASCADE)
