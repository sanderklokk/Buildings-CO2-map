import { create } from 'zustand'
import { createWasteReportFormSlice, WasteReportSlice } from './wastereportFormSlice'

type Store = WasteReportSlice & MapSearchSlice; 
    
export const useBoundStore = create<Store>((...a) => ({
    ...createWasteReportFormSlice(...a)
 }));