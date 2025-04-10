import { create } from 'zustand'
import { createWasteReportFormSlice, WasteReportSlice } from './wastereportFormSlice'
import { createMaterialManagementSlice, MaterialManagementSlice } from './materialManagementSlice';


type Store = WasteReportSlice & MaterialManagementSlice; 
    
export const useBoundStore = create<Store>((...a) => ({
    ...createWasteReportFormSlice(...a),
    ...createMaterialManagementSlice(...a),
 }));