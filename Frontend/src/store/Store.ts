import { create } from 'zustand'
import { createWasteReportFormSlice, WasteReportSlice } from './wastereportFormSlice'
import { createMapSearchSlice, MapSearchSlice } from './mapsearchSlice';
import { createMaterialManagementSlice, MaterialManagementSlice } from './materialManagementSlice';


type Store = WasteReportSlice & MapSearchSlice & MaterialManagementSlice; 
    
export const useBoundStore = create<Store>((...a) => ({
    ...createWasteReportFormSlice(...a),
    ...createMapSearchSlice(...a),
    ...createMaterialManagementSlice(...a)
}))