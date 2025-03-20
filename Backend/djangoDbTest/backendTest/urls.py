"""
URL configuration for backendTest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
import psycopg

urlpatterns = [
    path('admin/', admin.site.urls),
]


conn = psycopg.connect("dbname=CO2MapDb user=postgres")
conn.autocommit = True
cursor = conn.cursor()
# run 
# sudo -i -u postgres
# then
# sudo -i -u postgres
# name it dev and make it superuser. This is to enable creation script for db in django in each sartup.
# cursor.execute("""BEGIN
#    IF EXISTS (
#       SELECT FROM pg_catalog.pg_roles
#       WHERE  rolname = 'dev') THEN

#       RAISE NOTICE 'Role "dev" already exists. Skipping.';
#    ELSE
#       CREATE ROLE dev LOGIN PASSWORD 'dev' WITH CREATEDB CREATEROLE;
#    END IF;
# END""")
cursor
cursor.execute('DROP DATABASE IF EXISTS CO2MapDb')
cursor.execute('CREATE DATABASE CO2MapDb')
cursor.execute('CREATE TABLE bygning(id SERIAL PRIMARY KEY, bygnignsnr INT, bygningsstatuskode INT, kommune INT, bygningstypekode INT, anntalboenheter INT, antalletasjer INT, bebygdareal INT, bruksarealtotalt INT, bruksarealbolig INT, bruksarealannet INT, bygdDato DATE)')
cursor.execute('CREATE TABLE coordinates(bygningid INT PRIMARY KEY REFERENCES bygning(id) ON UPDATE CASCADE ON DELETE CASCADE, x FLOAT NOT NULL, Y FLOAT NOT NULL)')
cursor.execute('CREATE TABLE materialer(id SERIAL PRIMARY KEY, forelder INT, FOREIGN KEY (forelder) REFERENCES materialer(id), bygning REFERENCES bygning (id) NOT NULL ON DELETE CASCADE, mengde INT NOT NULL, totalmengde INT NOT NULL)')
cursor.execute('CREATE TABLE rapport(id SERIAL PRIMARY KEY NOT NULL, dato DATE NOT NULL, bygning REFERENCES bygning(id) NOT NULL ON DELETE CASCADE, materialerroot REFERENCES materialer(id) NOT NULL ON DELETE CASCADE)')
