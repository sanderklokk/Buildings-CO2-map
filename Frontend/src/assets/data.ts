/*
*
* All data in this file is for testing purposes and will be replaced with data from api
* 
*/

export interface Area {
  id: string;
  name: string;
  coordinatedStart: { lat: number; long: number };
  coordinatedEnd: { lat: number; long: number };
}
export interface BuildingType {
  id: string;
  name: string;
}

export const AREAS: Area[] = [
  {
    id: "0",
    name: "Gløshaugen",
    coordinatedStart: { lat: 63.420107999636414, long: 10.397439253252818 },
    coordinatedEnd: { lat: 63.41451149270749, long: 10.415612225157096 },
  },
  {
    id: "1",
    name: "St Olavs Hospital",
    coordinatedStart: { lat: 63.42180427473105, long: 10.382036500346734 },
    coordinatedEnd: { lat: 63.41864318926865, long: 10.394906912666633 },
  },
];

export const BUILDING_TYPES: BuildingType[] = [
  {
    id: "0",
    name: "Enebolig",
  },
  {
    id: "1",
    name: "Tomannbolig",
  },
  {
    id: "2",
    name: "Blokk under 3 etasjer",
  },
  {
    id: "3",
    name: "Blokk over 3 etasjer",
  },
];

export interface WasteMaterial {
  parent?: string;
  id: string;
  name: string;
  description: string;
  dangerous?: boolean;
}

const WASTEMATERIALS: WasteMaterial[] = [
  { id: "0", name: "Trevirke", description: "Overordnet kategori for trevirke" },
  { id: "1", name: "Metall", description: "Overordnet kategori for metall" },
  { id: "2", name: "Plast", description: "Overordnet kategori for plast" },
  { id: "3", name: "Elektronikk", description: "Elektronisk avfall" },
  { id: "4", name: "Farlig avfall", description: "Farlige stoffer og materialer", dangerous: true },
  { id: "5", name: "Batterier", description: "Ulike typer batterier", parent: "4", dangerous: true },
  { id: "6", name: "Litiumbatterier", description: "Batterier med litium", parent: "5", dangerous: true },
  { id: "7", name: "Bilbatterier", description: "Blybatterier fra kjøretøy", parent: "5", dangerous: true },
  { id: "8", name: "Trykkimpregnert trevirke", description: "Trykkimpregnert trevirke", parent: "0" },
  { id: "9", name: "Møbeltrevirke", description: "Trevirke fra møbler", parent: "0" },
  { id: "10", name: "Kobber", description: "Kobbermetaller", parent: "1" },
  { id: "11", name: "Aluminium", description: "Aluminium og aluminiumslegeringer", parent: "1" },
  { id: "12", name: "Stål", description: "Stål og jernlegeringer", parent: "1" },
  { id: "13", name: "Rustfritt stål", description: "Korrosjonsbestandig stål", parent: "12" },
  { id: "14", name: "Blandet plast", description: "Usortert plastavfall", parent: "2" },
  { id: "15", name: "PET-plast", description: "Polyetylentereftalat", parent: "2" },
  { id: "16", name: "PVC", description: "Polyvinylklorid", parent: "2" },
  { id: "17", name: "Elektriske kabler", description: "Kabelføring og ledninger", parent: "3" },
  { id: "18", name: "Kjøleskap", description: "Hvitevarer", parent: "3", dangerous: true },
  { id: "19", name: "TV-skjermer", description: "Elektroniske skjermer", parent: "3" },
  { id: "20", name: "Mobiltelefoner", description: "Elektroniske kommunikasjonsenheter", parent: "3" },
  { id: "21", name: "Oljeavfall", description: "Brukt olje", parent: "4", dangerous: true },
  { id: "22", name: "Maling og lakk", description: "Farlig kjemisk avfall", parent: "4", dangerous: true },
  { id: "23", name: "Asbest", description: "Helsefarlig materiale", parent: "4", dangerous: true },
  { id: "24", name: "Kvikksølv", description: "Giftig metall", parent: "4", dangerous: true },
  { id: "25", name: "Radioaktivt avfall", description: "Strålingsfarlig materiale", parent: "4", dangerous: true },
  { id: "26", name: "Gips", description: "Gipsmaterialer", parent: "0" },
  { id: "27", name: "Glass", description: "Glassavfall", parent: "3" },
  { id: "28", name: "Keramikk", description: "Keramiske produkter", parent: "3" },
  { id: "29", name: "Papp", description: "Papp og papir", parent: "3" },
  { id: "30", name: "Papir", description: "Ulike typer papiravfall", parent: "3" },
  { id: "31", name: "Uran", description: "Radioaktivt materiale", dangerous: true },
  { id: "32", name: "Bly", description: "Giftig metall", parent: "1", dangerous: true },
  { id: "33", name: "Sink", description: "Brukes i galvanisering", parent: "1" },
  { id: "34", name: "Tinn", description: "Tinnlegeringer", parent: "1" },
  { id: "35", name: "Magnesium", description: "Lettmetall", parent: "1" },
  { id: "36", name: "Betong", description: "Bygningsmateriale", parent: "0" },
  { id: "37", name: "Murstein", description: "Byggemateriale", parent: "0" },
  { id: "38", name: "Fliser", description: "Keramiske fliser", parent: "0" },
  { id: "39", name: "Solceller", description: "Elektroniske paneler", parent: "3", dangerous: true },
  { id: "40", name: "Sprøytemidler", description: "Farlige kjemikalier", parent: "4", dangerous: true },
  { id: "41", name: "Gassbeholdere", description: "Trykkbeholdere", parent: "4", dangerous: true },
  { id: "42", name: "Medisinsk avfall", description: "Helsefarlig avfall", parent: "4", dangerous: true },
  { id: "43", name: "Lysrør", description: "Elektriske lyskilder", parent: "3", dangerous: true },
  { id: "44", name: "Komposittmaterialer", description: "Blandet materialer", parent: "0" },
  { id: "45", name: "Dekk", description: "Gummiavfall", parent: "2" },
  { id: "46", name: "Motorolje", description: "Brukt motorolje", parent: "4", dangerous: true },
  { id: "47", name: "Bremsevæske", description: "Farlig kjemisk avfall", parent: "4", dangerous: true },
  { id: "48", name: "Kjemiske løsemidler", description: "Industrielt kjemikalie", parent: "4", dangerous: true }
];

export const WASTE_MATERIALS = WASTEMATERIALS;
