### The Database
For table entries from matrikkel, see the [documentation](./../Docs/data.md)
## Tables
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
    - `navn`: 
    - `forelder`: 
    - `farlig`: 

- `koordinater`
    - `bygningid`: 
    - `x`: 
    - `y`: 

- `materialer`
    - `bygning`: 
    - `type_materiale`: 
    - `mengde`: 
    - `totalmengde`: 

- `rapport`
    - `id`: **Integer Primary key**
    - `bygning`: 
    - `dato`: 
    - `address`: 
    - `postalcode`: 
    - `postalplace`: 
    - `berortbra`: 
    - `bygningstype`:
    - `konstruksjonstype`:
    - `handtering`: 
    - `type`: 

- `rapportmateriale`
    - `rapport`: 
    - `materiale`: 
    - `planlagtmengde`: 
    - `faktiskmengde`: 
    - `mengdetilgjenbruk`: 
    - `mengdetilanlegg`: 
    - `anlegg`: 
    - `totalmengde`: 
## ER - Diagram
![image](./../Docs/database%20diagram.png)
