export interface SubMaterial {
  id: number;
  name: string;
  subcategories?: SubMaterial[];
}

export interface Material {
  id: number;
  name: string;
  active: boolean;
  subcategories: SubMaterial[];
}
