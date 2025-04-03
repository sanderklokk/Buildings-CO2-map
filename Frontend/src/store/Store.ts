import { create } from 'zustand'
import { createWasteReportFormSlice, WasteReportSlice } from './wastereportFormSlice'
import { createMapSearchSlice, MapSearchSlice } from './mapsearchSlice';

type Store = WasteReportSlice & MapSearchSlice; 
    
export const useBoundStore = create<Store>((...a) => ({
    ...createWasteReportFormSlice(...a),
    ...createMapSearchSlice(...a),
 }));