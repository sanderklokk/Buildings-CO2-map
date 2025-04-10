# IT2901 P19 Buildings CO2 map
## Prosjekt for ITP2 via NTNU og Trondheim Komune 

How to contribute

1. All folders and classes have captial letter first.
2. Make sure you don't push the data, only use your local version.
3. Use conventional commits convention


## setup and run the database
**install dependecies**
1. install required pip packages from requirements.txt (recomend using a virtual enviroment). Run the following command from ```/Backend```
```bash
pip install -r requirements.txt
```
2. [install postgres](https://www.postgresql.org/download/) and pgadmin4
    * pgadmin4 can be checked as an option in the postgres installer.
    * The project was setup using postgres 17.2

**Create the database**
1. [Create a user](https://www.pgadmin.org/docs/pgadmin4/8.14/user_management.html) in pgadmin. **Warning: do not choose one of your real passwords. This will be stored as plain text later**
2. [Create a database](https://www.pgadmin.org/docs/pgadmin4/8.14/database_dialog.html) in pgadmin, and make sure it's named **buildingsc02-dev**. Make your user from step 1 the owner

**add enviroment variables to connect Django and your database**    
from: https://docs.djangoproject.com/en/5.1/ref/databases/#postgresql-notes
1. create a file called ```.pg_service.conf``` in your home folder and add these variables:
``` bash
[my_service]
host=localhost
user=william #change to your username
dbname=buildingsc02-dev #change if your DB has another name
port=5432

``` 
2. create a file called ```.my_pgpass``` in your home folder and add configure the authentication credentials for the database like this:

``` bash
localhost:5432:buildingsc02-dev:<username>:<password> #change username and password to match your user
``` 
## Setup and run using docker
**Docker**
The project contains a docker-compose.yml file. This is the easiest way to start the project. The port used for this is 5432 and the docker will not start if the port is taken by another process. 
1. create a file called ```.pg_service.conf``` in your home folder and add these variables:
``` bash
[my_service]
host=localhost
user=postgres 
password=postgres 
dbname=buildingsc02-dev 
port=5432

``` 
**Django usage**
* **Migrate the database** using ```python manage.py migrate [migration name]```. Migration name is optiional. Leave empty to use the latest migration file (do this the first time you clone the repo).
* **Make new migrations.** Whenever changes to the data models are done, the database schema must be updated as well, do this by making and applying a new migration. By doing this, the database can also be rolled back to a previous schema using the above step.
``` bash
python manage.py makemigrations --name a_s49-dokumetasjonuitable_label #the --name flag is optional, but recomended to more easily keep track of the migration files. 
```

## Expected Input
The program currently expects to recieve the initial data through json files that may be read by the [initialisation script](/Backend/App/Management/Foo.py). 

This is script populates the database, and can be run with 
```bash
manage.py management
```
THis script expects the Buildings-CO2-Map/Data to contain two .json files named data14.json and data15.json.
Data14.json is of the form: 

```bash
{"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [(x), (y)], "properties": {"bygningstatuskode": (bygningsstatuskode), "dato": (bygdDato),"msid": (int),"bygningsnr": (bygnignsnr)}}]}
```
where x and y in coordinates ill be used for the x and y fields in the koordinater table in the database. Fields in properties match the fields of the bygning table with the exeption of msid wich is to be ignored.

**Example**
```bash
{"type": "FeatureCollection", "features": [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [10.4369016902098, 63.3077466673765]}, "properties": {"bygningstatuskode": "TB", "dato": "1983-04-17T22:00:00+0000", "msid": 166032650, "bygningsnr": 1234567}}]}
```
Data15.json is of the form:
```bash
{"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {"msid": 12345678, "kommune": (kommune), "bygningsnr": (bygnignsnr), "tilbyggsnr": null, "bygningstypekode": "(bygningstypekode)", "bygningstatuskode": "(bygningsstatuskode)", "antallboenheter": (anntalboenheter), "antalletasjer": (antalletasjer), "bebygdareal": (bebygdareal), "bruksarealtotalt": (bruksarealtotalt), "bruksarealbolig": (bruksarealbolig), "bruksarealannet": (bruksarealannet), "endringstidspunkt": "2040-01-19T23:00:00+0000"}}]}
```
Where kommune, bygningsnr, bygningstypekode, bygningsstatuskode, anntalboenheter, antalletasjer, bebygdareal, bruksarealtotalt, bruksarealbolig and bruksarealannet is used to populate the columns with matching names in the bygning table in the database. The rest of the fields are not used, but they are expected by the program and should therefore be included.

**Example**
```bash
{"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {"msid": 166032650, "kommune": 5001, "bygningsnr": 3435318, "tilbyggsnr": null, "bygningstypekode": "111", "bygningstatuskode": "TB", "antallboenheter": 1, "antalletasjer": 1, "bebygdareal": 0, "bruksarealtotalt": 210, "bruksarealbolig": 210, "bruksarealannet": 0, "endringstidspunkt": "2040-01-19T23:00:00+0000"}}]}
```
## Frontend
The frontend is dependent on the user having working installations of npm and node.js. 

### Run the frontend map
1. Install npm and run Run the following command from ```/Frontend``` to install the requirements from package.json.
```bash
npm install
```
2. Run the following command from ```/Frontend``` to start the project at http://localhost:5173/    
```bash
npm run dev
```

