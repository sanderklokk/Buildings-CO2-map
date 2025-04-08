import { StateCreator } from "zustand";
import { APIMaterialType } from "../api/models";



export interface MaterialManagementSlice {
    materialManagementSlice: {
        materials: APIMaterialType[];
        setMaterials: (materials: APIMaterialType[]) => void;
        replaceMaterials: (materials: APIMaterialType[]) => void;
        removeMaterial: (id: string) => void;
    }
}


/**
 * State handling all data related to waste report form
*/
export const createMaterialManagementSlice: StateCreator<MaterialManagementSlice> = (set) => ({
    materialManagementSlice: {
        materials: [],
        setMaterials: (materials: APIMaterialType[]) => {
            set((state) => ({
                materialManagementSlice: {
                    ...state.materialManagementSlice,
                    materials: materials,
                },
            }));
        },
        replaceMaterials: (materials: APIMaterialType[]) => {
            set((state) => ({
                materialManagementSlice: {
                    ...state.materialManagementSlice,
                    materials: [...state.materialManagementSlice.materials.filter((mat) => !materials.map(m => m.id).includes(mat.id)), ...materials],
                },
            }));
        },
        removeMaterial: (id: string) => {
            set((state) => ({
                materialManagementSlice: {
                    ...state.materialManagementSlice,
                    materials: state.materialManagementSlice.materials.filter((mat) => mat.id !== id),
                },
            }));
        }
    }
}); 