### The Database
For table entries from matrikkel, see the [documentation](./../Docs/data.md)
## Tables
- `bygning`
    - `bygnignsnr` : Taken from matrikkel
    - `bygningsstatuskode` : Taken from matrikkel 
    - `kommune` : Taken from matrikkel 
    - `bygningstypekode` : Taken from matrikkel 
    - `anntalboenheter` : Taken from matrikkel 
    - `antalletasjer` : Taken from matrikkel 
    - `bebygdareal` : Taken from matrikkel 
    - `bruksarealtotalt` : Taken from matrikkel 
    - `bruksarealbolig` : Taken from matrikkel 
    - `bruksarealannet`: Taken from matrikkel 
    - `bygdDato`: Taken from matrikkel 

- `materialtype`
    - `id`: 
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
    - `id`: 
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
