# The Backend API
The backend is, as described in the [main README file](/README.md) based on django using postgres as the database. The model communicates ith the frontend by posting its results to the database, wich the frontend gets data from as needed.
## API-functions
The api functions are defined as views in [views.py](/Backend/App/views.py).
The urls for the functions are defined in [urls.py](/Backend/App/urls.py).
And the main adress is http://localhost:5173 as defined in [settings.py](/Backend//Backend/settings.py).
### GET


### POST

## The database
For table entries from matrikkel, see the [documentation](./../Docs/data.md)
### Tables
- `bygning`
    - `bygnignsnr`: **Integer Primary key** -  Taken from matrikkel
    - `bygningsstatuskode`: **Char[5]** - Taken from matrikkel 
    - `kommune`: **Integer** - Taken from matrikkel 
    - `bygningstypekode`: **Integer** - Taken from matrikkel 
    - `anntalboenheter`: **Integer** - Taken from matrikkel 
    - `antalletasjer`: **Integer** - Taken from matrikkel 
    - `bebygdareal`: **Integer** - Taken from matrikkel 
    - `bruksarealtotalt`: **Integer** - Taken from matrikkel 
    - `bruksarealbolig`: **Integer** - Taken from matrikkel 
    - `bruksarealannet`: **Integer** - Taken from matrikkel 
    - `bygdDato`: **Date** - Taken from matrikkel 

- `materialtype`
    - `id`: **Integer Primary key** 
    - `navn`: **string[100]**
    - `forelder`: **Integer Foreign key** materialtype.id
    - `farlig`: **Boolean** default False. Boolean for weather this matrial type is concidered dangerous.

- `koordinater`
    - `bygningid`: **Integer Primary key** 
    - `x`: **Integer**
    - `y`: **Integer**

- `materialer`
    - `bygning`: **Integer Foreign key** 
    - `type_materiale`: **Integer Foreign Key** materialtype(id)
    - `mengde`:  **Integer**
    - `totalmengde`:  **Integer**

- `rapport`
    - `id`: **Integer Primary key**
    - `bygning`:  **Integer Foreign key** bygning.bygnignsnr
    - `dato`: **Date**
    - `address`: **char[100]**
    - `postalcode`:  **Integer**
    - `postalplace`: **char[100]**
    - `berortbra`: **Integer**
    - `bygningstype`: **char[100]**
    - `konstruksjonstype`: **char[100]**
    - `handtering`: **char[300]**
    - `type`: **char[100]**

- `rapportmateriale`
    - `rapport`: **Integer Foreign key** rapport.id
    - `materiale`: **Integer Foreign Key** materialtype.id
    - `planlagtmengde`: **Integer**
    - `faktiskmengde`: **Integer**
    - `mengdetilgjenbruk`: **Integer**
    - `mengdetilanlegg`: **Integer**
    - `anlegg`: **Char[100]**
    - `totalmengde`: **Integer** sum of mengdetilanlegg and mengdetilgjenbruk.
### ER - Diagram of the database
![image](./../Docs/database%20diagram.png)
