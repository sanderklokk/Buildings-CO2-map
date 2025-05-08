import { StateCreator } from "zustand";
import { APIMapBuilding } from "../api/models";

export interface MapSlice {
  mapSlice: {
    buildings: APIMapBuilding[];
    setBuildings: (buildings: APIMapBuilding[]) => void;
    hurtigSokResult: APIMapBuilding | null;
    setHurtigSokResult: (result: APIMapBuilding | null) => void;
  };
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
    hurtigSokResult: null,
    setHurtigSokResult: (result: APIMapBuilding | null) => {
      set((state) => ({
        mapSlice: {
          ...state.mapSlice,
          hurtigSokResult: result,
        },
      }));
    },
  },
});
