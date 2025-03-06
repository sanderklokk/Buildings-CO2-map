// Later fetch from api most likely
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
