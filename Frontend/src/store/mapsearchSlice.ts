import { StateCreator } from "zustand";
import { APICoordinatesBuildingSearchResult } from "../api/mapsearchAPI";


export interface MapSearchSlice {
    mapSearch: {
        hurtigsok: {
            result: APICoordinatesBuildingSearchResult | null;
        },
        setHurtigsokResult: (result: APICoordinatesBuildingSearchResult | null) => void;
    },

}


/**
 * State handling all data related to waste report form
*/
export const createMapSearchSlice: StateCreator<MapSearchSlice> = (set) => ({
    mapSearch: {
        hurtigsok: {
            result: null,
        },
        setHurtigsokResult: (result: APICoordinatesBuildingSearchResult | null) => set((state) => ({
            mapSearch: {
                ...state.mapSearch,
                hurtigsok: {
                    ...state.mapSearch.hurtigsok,
                    result,
                }
            }
        })),
    }
})