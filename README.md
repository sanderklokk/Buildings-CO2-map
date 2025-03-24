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

**Django usage**
* **Migrate the database** using ```python manage.py migrate [migration name]```. Migration name is optiional. Leave empty to use the latest migration file (do this the first time you clone the repo).
* **Make new migrations.** Whenever changes to the data models are done, the database schema must be updated as well, do this by making and applying a new migration. By doing this, the database can also be rolled back to a previous schema using the above step.
``` bash
python manage.py makemigrations --name a_suitable_label #the --name flag is optional, but recomended to more easily keep track of the migration files. 
```
