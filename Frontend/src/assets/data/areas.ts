export interface Area {
  id: number;
  label: string;
  latStart: number;
  longStart: number;
  latEnd: number;
  longEnd: number;
}

export const AREAS: Area[] = [
  {
    id: 1,
    label: "Midtbyen",
    longEnd: 63.43171063879451,
    latStart: 10.394768824060643,
    longStart: 63.429351118361225,
    latEnd: 10.401967537780488,
  },
  {
    id: 2,
    label: "Lerkendal",
    longEnd: 63.413926671304694,
    latStart: 10.397500653942311,
    longStart: 63.4088725399265,
    latEnd: 10.417099890490258,
  },
];
