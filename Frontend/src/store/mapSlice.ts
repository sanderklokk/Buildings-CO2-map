import { StateCreator } from "zustand";
import { APIMapBuilding } from "../api/models";



export interface MapSlice {
    mapSlice: {
        buildings: APIMapBuilding[];
        setBuildings: (buildings: APIMapBuilding[]) => void;
    }
}

/**
 * State handling all data and actions related to material management
*/
export const createMapSlice: StateCreator<MapSlice> = (set) => ({
    mapSlice: {
        buildings: [],
        setBuildings: (buildings: APIMapBuilding[]) => {
            set((state) => ({
                mapSlice: {
                    ...state.mapSlice,
                    buildings: buildings,
                },
            }));
        },
    }
});