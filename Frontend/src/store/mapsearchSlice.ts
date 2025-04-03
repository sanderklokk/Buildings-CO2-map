import { StateCreator } from "zustand";


export interface MapSearchSlice {
    mapSearch: {
        hurtigsok: {
            result: {
                lat: number;
                lon: number;
            } | null;
        },
        setHurtigsokResult: (result: {
            lat: number;
            lon: number;
        } | null) => void;
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
        setHurtigsokResult: (result: {
            lat: number;
            lon: number;
        } | null) => set((state) => ({
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