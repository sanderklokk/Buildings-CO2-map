import { StateCreator } from "zustand";
import { APIMaterialType } from "../api/models";



export interface MaterialManagementSlice {
    materialManagementSlice: {
        materials: APIMaterialType[];
        setMaterials: (materials: APIMaterialType[]) => void;
        replaceMaterials: (materials: APIMaterialType[]) => void;
        removeMaterial: (id: number) => void;
    }
}

/**
 * State handling all data and actions related to material management
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
        removeMaterial: (id: number) => {
            set((state) => ({
                materialManagementSlice: {
                    ...state.materialManagementSlice,
                    materials: state.materialManagementSlice.materials.filter((mat) => mat.id !== id),
                },
            }));
        }
    }
}); 