/*
    id = models.AutoField(primary_key=True)
    bygning = models.ForeignKey(bygning, on_delete=models.CASCADE)

    dato = models.DateField()
    address = models.CharField(max_length=100)
    postalcode = models.IntegerField()
    postalplace = models.CharField(max_length=100)
    berortbra = models.IntegerField()
    bygningstype = models.CharField(max_length=100)
    konstruksjonstype = models.CharField(max_length=100)
    handtering = models.CharField(max_length=300)
    type = models.CharField(max_length=100)


     rapport = models.ForeignKey(rapport, on_delete=models.CASCADE)
    materiale = models.ForeignKey(materialtype, on_delete=models.CASCADE)
    planlagtmengde = models.IntegerField()
    faktiskmengde = models.IntegerField()
    mengdetilgjenbruk = models.IntegerField()
    mengdetilanlegg = models.IntegerField()
    anlegg = models.CharField(max_length=100)
    totalmengde = models.IntegerField()
    */

export interface APIWasteReportMaterial {
    id: number | null;
    materiale: number;
    planlagtmengde: number;
    faktiskmengde: number;
    mengdetilgjenbruk: number;
    mengdetilanlegg: number;
    anlegg: string;
    totalmengde: number;
}


export interface APIWasteReport {
    id: number | null;
    bygning: number | null;
    dato: string;
    address: string;
    postalcode: number;
    postalplace: string;
    berortbra: number;
    bygningstype: string;
    konstruksjonstype: string;
    handtering: string;
    type: string;
    materialer: APIWasteReportMaterial[];
}
