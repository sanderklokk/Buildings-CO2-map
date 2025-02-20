# Dokumentasjon for data14.json og data15.json

Dette dokumentet beskriver strukturen og innholdet i data14.json og data15.json. Diese datasettene gir henholdvis grunnleggende og detaljert informasjon om bygninger.
- Nøkler for kobling: `bygningsnr` og `msid`
- **data14** gir overordnet informasjon om bygninger.
- **data15** gir detaljert tilleggsinformasjon for bygningene i data14.

## Data 14

### `properties`
- `bygningsnr`: Unik ID for bygningen. Brukes som primærnøkkel i data14 og som foreign key for kobling med data15.

- `msid`: En eller annen ID (antar relatert til et unikt byggingsobjekt). Kanskje gårdsnummer?? *TO-DO: finn ut av det*

- `dato`: Dato i ISO 8601-format (antar dump timestamp som viser når dataen ble generert intil videre). *TO-DO: finn ut hva det faktisk vil si*

- `bygningsstatuskode`: Kode for fysisk/juridisk tilstand til bygget / hvor bygget er i bygningsprosessen. Verdier i dette datasettet:
  - `TB`: Bygning er tatt i bruk - I bruk, inkluder i kartet
  - `FA`: Ferdigattest - Bygget står ferdig, skal med i kartet
  - `BR`: Bygning er revet eller brent - Skal fjernes fra kartet
  - `BU`: Bygningsnummer er utgått - Skal fjernes fra kartet
  - `IG`: Igangsettingstillatelse - Ikke ferdig, skal ikke være på kartet
  - `BA`: Bygging avlyst - Skal fjernes fra kartet
  - `MB`: Midlertidig brukstillatelse - I bruk, skal være på kartet
  - `RA`: Rammetillatelse - Ikke ferdigbygd, ikke inkludert i kartet
  - `MF`: Meldingsak tiltak fullført - Tilltak fullført, inkluder i kartet
  - `GR`: Bygning godkjent revet/brent - Fjernes fra kartet
  - `IP`: Ikke pliktig registrert - Untatt regelverket, skal være på kartet
  - `FS`: Frittatt for søknadsplikt - Skal være på kartet, bygg under grensen for søknadsplikt
  - `BF`: Bygning flyttet - Skal fjernes fra kartet
  - `MT`: Meldingsak registrer tiltak - Tilltak ikke fullført, ikke inkluder i kartet
  - Flere koder: [BygningsstatusKode fra GeoNorge](https://objektkatalog.geonorge.no/Objekttype/Index/EAID_5631E82B_3B83_42e3_8E2B_83A3A20DAF8D)

### `features.geometry.coordinates`
- Koordinatene for bygget i formen `[breddegrad, lengdegrad]` (ikke motsatt slik f.eks. google maps forventer (`[lengdegrad, breddegrad]`))

### Metadata som kan ignoreres:
- `type: feature collections`: Overordnet array. Ignorer, ettersom at vi kun ser på innmaten av det nøstede arrayet.

- `features: [{type}]`: Er kun av typen `Feature`. Dette er unødvendig metadata. Se bortifra når vi konverterer til pandas DF.

- `features: [geometry: {type: }]`: Kun av typen `point`. Unødvendig metadata som sier at featuren er en koordinat, så se bortifra når etter vi konverterer til pandas DF.


## Data 15

### `properties`
- `msid`: Samme som i data14. Kobler bygninger mellom datasettene.

- `kommune`: Kommunenummer der bygget befinner seg (f.eks. `5001` for Trondheim).

- `bygningsnr`: Unik ID for bygget, også brukt i data14.

- `tilbyggsnr`: Tilleggsnummer for tilbygg. `null` hvis ikke relevant.

- `bygningstypekode`:
  Kode som angir bygningstypen. Koden gis ved 3-siffrede tall hvor hvert siffer peker ut en node i hvert nivå av klassifiseringstreet.
Så 135 = hovedkategori 1: bolig, underkategori 5: Bygning for bofellesskap, type 1: Bo- og servicesenter. f.eks.:
  - `111`: Enebolig
  - `112`: Enebolig m/hybel/sokkelleilighet
  - `131`: Rekkehus
  - `212`: Verkstedbygning
  - `722`: Bo- og behandlingssenter
  - `null`: Ikke spesifisert
  - Flere koder: [Standard for bygningstype / Matrikkelen fra SSB](https://www.ssb.no/klass/klassifikasjoner/31/koder)
  - Fullstendig oversikt ligger i Public Data/64.csv.

- `bygningsstatuskode`: Kode for fysisk/juridisk tilstand til bygget / hvor bygget er i bygningsprosessen. Verdier i dette datasettet:
  - `TB`: Bygning er tatt i bruk - I bruk, inkluder i kartet
  - `FA`: Ferdigattest - Bygget står ferdig, skal med i kartet
  - `BR`: Bygning er revet eller brent - Skal fjernes fra kartet
  - `BU`: Bygningsnummer er utgått - Skal fjernes fra kartet
  - `IG`: Igangsettingstillatelse - Ikke ferdig, skal ikke være på kartet
  - `BA`: Bygging avlyst - Skal fjernes fra kartet
  - `MB`: Midlertidig brukstillatelse - I bruk, skal være på kartet
  - `RA`: Rammetillatelse - Ikke ferdigbygd, ikke inkludert i kartet
  - `MF`: Meldingsak tiltak fullført - Tilltak fullført, inkluder i kartet
  - `GR`: Bygning godkjent revet/brent - Fjernes fra kartet
  - `IP`: Ikke pliktig registrert - Untatt regelverket, skal være på kartet
  - `FS`: Frittatt for søknadsplikt - Skal være på kartet, bygg under grensen for søknadsplikt
  - `BF`: Bygning flyttet - Skal fjernes fra kartet
  - `MT`: Meldingsak registrer tiltak - Tilltak ikke fullført, ikke inkluder i kartet
  - Flere koder: [BygningsstatusKode fra GeoNorge](https://objektkatalog.geonorge.no/Objekttype/Index/EAID_5631E82B_3B83_42e3_8E2B_83A3A20DAF8D)

- `antallboenheter`:
  Antall boenheter i bygget. `0` angir ingen boenheter (f.eks. næringsbygg)

- `antalletasjer`:
  Antall etasjer i bygget. `0` kan forekomme for tilbygg eller uferdige bygg. Men 0 på veldig mange av byggene👀 Sus

- `bebygdareal`:
  Areal i m² som bygget dekker på bakken. `0` hvis ikke oppgitt. Står 0 på 90% av registrerte bygg👀 Sus

- `bruksarealtotalt`:
  Totalt bruksareal i m².

- `bruksarealbolig`:
  Bruksareal som brukes til boligformål.

- `bruksarealannet`:
  Bruksareal som brukes til andre formål enn bolig.

- `endringstidspunkt`:
  Tidspunkt for siste endring relatert til bygningen, gitt i ISO 8601-format.


## Eksempler fra JSON-data:

### Fra data14: Enebolig med koordinater
```json
{
  "bygningsnr": 3435318,
  "msid": "12345678",
  "dato": "2025-01-01T12:00:00Z",
  "bygningsstatuskode": "FA",
  "geometry": {
    "coordinates": [63.430515, 10.395053]
  }
}
```
### Fra data15: Enebolig med bygningsareal 210 m²
```json
{
  "bygningsnr": 3435318,
  "kommune": "5001",
  "bygningstypekode": "111",
  "antallboenheter": 1,
  "antalletasjer": 1,
  "bebygdareal": 120,
  "bruksarealtotalt": 210,
  "bruksarealbolig": 210,
  "bruksarealannet": 0,
  "endringstidspunkt": "2025-01-02T10:00:00Z"
}
```
