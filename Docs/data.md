To-Do: 
* Gå over data15
* Strukturer/formuler bedre
* Sub-To-Dos under

## Data 14
**properties: [properties: bygningsnnr]**: Unik nummer for bygget (funker som foreign key til data15)

**properties: [properties: msid]**: En eller annen ID TO-DO: finn ut av det

**properties: ["properties": dato]**: Dato

**properties: ["properties": "bygningsstatuskode: ]**: strings. Verdier (i dette datasettet): TB, MB, MF, FA

**features: [geometry: {coordinates: }]**: Koordinatene for bygget TO-DO: (Finn ut av koordinattype. Byggene er ikke midt i det arabiske hav)

**type: feature collections**: Overordna array. Ignorer, ettersom at vi kun ser på innmaten av det nøstede arrayet  

**features: [{type}]**: Er kun av typen Feature. Dette er unødvendig metadata. Se bortifra når vi konverterer til pandas DF

**features: [geometry: {type: }]**: Kun av typen point. Unødvendig metadata som sier at featuren er en koordinat, så se bortifra når etter vi konverterer til pandas DF  
## Data 15