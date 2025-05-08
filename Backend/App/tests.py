from django.test import TestCase, TransactionTestCase
from App.models import Bygning, materialtype
# Create your tests here.
# IMPORTANT!!! tests inside class MUST start with test to run




# use negative ids when creating dummy test data.
class apiPostTests(TestCase):
    def setUp(self):
        payload = {
            'id': '',
            'forelder': '',
            'navn': 'test1',
            'farlig': 'False',
            'synlig': 'True'
        }
        response = self.client.post('/api/materialtype/create', payload, format='json')
        # ids are dynamically created   
        payload = {
            'id': '',
            'forelder': materialtype.objects.get(navn="test1").id,
            'navn': 'test2',
            'farlig': 'True',
            'synlig': 'True'
        }
        response = self.client.post('/api/materialtype/create', payload, format='json')

        payload = {
            'id': '',
            'forelder': materialtype.objects.get(navn="test2").id,
            'navn': 'test3',
            'farlig': 'False',
            'synlig': 'False'
        }
        response = self.client.post('/api/materialtype/create', payload, format='json')



    def testCreateMaterialTypeExist(self):

        self.assertTrue(materialtype.objects.filter(navn="test1").exists())
        self.assertTrue(materialtype.objects.filter(navn="test2").exists())
    def testCreateMaterialerParent(self):
        test1id= str(materialtype.objects.get(navn="test1").id)
        self.assertTrue(materialtype.objects.get(navn="test2").id == materialtype.objects.get(forelder=test1id).id)

    def testNoParent(self):
        test1Parent= str(materialtype.objects.get(navn="test1").forelder)
        # print(materialtype.objects.all().values("forelder"))
        self.assertFalse(test1Parent in materialtype.objects.all().values())

    def testDelete(self):
        payload = {
            'id': materialtype.objects.get(navn="test2").id
        }
        # print(materialtype.objects.all().values("id", "navn", "forelder"))
        self.assertIn(("test2",), materialtype.objects.all().values_list("navn"))

        response = self.client.delete('/api/materialtype/delete', data = payload, format='json', content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(materialtype.objects.get(navn="test1").id, materialtype.objects.get(navn="test3").forelder.id)
        self.assertNotIn(("test2",), materialtype.objects.all().values_list("navn"))
    
    # for docs: the program expects a list containing json objects.
    def testUpdate(self):
        self.assertNotIn(("test3",),materialtype.objects.filter(synlig=1).values_list("navn"))
        payload = [{"id": int(materialtype.objects.get(navn="test3").id),
                    "forelder": int(materialtype.objects.get(navn="test2").id),
                    "navn": "test3","farlig": False,
                    "synlig": True}, 
                    {"id": int(materialtype.objects.get(navn="test2").id),
                    "forelder": int(materialtype.objects.get(navn="test1").id),
                    "navn": "test3","farlig": False,
                    "synlig": False}]
        
        response = self.client.put('/api/materialtype/update', payload, format='json', content_type='application/json')
        self.assertEqual(200, response.status_code)
        self.assertIn(("test3",), materialtype.objects.filter(synlig="True").values_list("navn"))
        self.assertNotIn(("test2",), materialtype.objects.filter(synlig="True").values_list("navn"))

    def testWasteReport(self):
        payload = {
            "address":"test",
            "bygning": 3435318,
            "postalcode": 9999,
            "postalplace": "Testing",
            "berortbra" : 0,
            "bygningstype": "test",
            "konstruksjonstype": "test",
            "handtering" :"Test",
            "type" : "test",
            "materialer": [{
                    "materiale": int(materialtype.objects.get(navn="test2").id),
                    "planlagtmengde" : 44.0,
                    "faktiskmengde" : 50.0,
                    "mengdetilgjenbruk" : 20.0,
                    "mengdetilanlegg" : 20.0,
                    "anlegg" : "test",
                    "totalmengde" : 20
            }]
        }
        response = self.client.post('/api/wastereport/create', payload, format="json", content_type='application/json')
        self.assertEqual(200, response.status_code)

        response = self.client.get("/api/wastereport/all")
        self.assertEqual(200, response.status_code)

def circleRecursiveCheck(a, id):
    if (materialtype.objects.get(id=id).id in a):
        return False
    elif (type(materialtype.objects.get(id=id).forelder)==type(None)):
        return True
    else:
        a.append(id)
        return circleRecursiveCheck(a, materialtype.objects.get(id=id).forelder.id)
    
class dbLegal(TestCase):

# check for circular inheritance in db trees
    def testCircular(self):
        a = materialtype.objects.all().values_list("id")
        # print(a)
        # print(materialtype.objects.all().values_list("id", "forelder"))
        for i in a:
            k = []
            self.assertTrue(circleRecursiveCheck(k, i[0]))



# class modelTest(TestCase):
#     # running test to check db is correct.
#     def testconcistentForeignKey(self):


    # def wastereportAll(self):

    # def wastereportInt(self):
    
    # def bygningBymaterial(self):

    # def bygningBybygningsnrInt(self):
    
    # def bygningSquareselect(self):

    # def bygningNearby(self):

    # def bygningNearbymaterial(self):

    # def materialtypeAll(self):

# class apiPostTest(TestCase):

#     def materialtypeCreate(self):

    # def materialtypeUpdate(self):

    # def materialtypeDelete(self):



    # def testRefortResponse(self):
# class apiWastereportCreate(TestCase):

# class apiWastereportInt(TestCase):

# class apiBygningBymaterial(TestCase):

# class bygningBybygningsnrInt(TestCase):

# class apiBygningSquareselect(TestCase):

# class apiBygningNearby(TestCase):

# class apiBygningNearbymaterial(TestCase):

# class apiMaterialtypeAll(TestCase):

# class apiMaterialtypeCreate(TestCase):

# class apiMaterialtypeUpdate(TestCase):

# class apiMaterialtypeDelete(TestCase):

# no launch of application testing should start with an empty db. Houses are nessecary for the model to make sense
# class database(TransactionTestCase):
#     def setUp(self):
#         # Setup run before every test method.
#         pass

#     def tearDown(self):
#         # Clean up run after every test method.
#         pass
#     def testNotEmpty(self):
#         print(Bygning.objects.all().values('byggningsnr').values_list())
#         self.assertNotEqual(Bygning.objects.all().count(), 0)
# check that all foreign keys refference real buildings
    # def byggningsnrForeignKeys(self):


