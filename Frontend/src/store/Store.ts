import { create } from 'zustand'
import { createWasteReportFormSlice, WasteReportSlice } from './wastereportFormSlice'
import { createMaterialManagementSlice, MaterialManagementSlice } from './materialManagementSlice';
import { MapSlice, createMapSlice } from './mapSlice';


type Store = WasteReportSlice & MaterialManagementSlice & MapSlice; 
    
export const useBoundStore = create<Store>((...a) => ({
    ...createWasteReportFormSlice(...a),
    ...createMaterialManagementSlice(...a),
    ...createMapSlice(...a),
 }));