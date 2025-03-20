import { StateCreator } from "zustand";
import { WASTE_MATERIALS } from "../assets/data";

export interface EiendomData {
    address: string;
    postalCode: string;
    postalPlace: string;
}

export interface TiltakData {
    berortBRA: number;
    bygningstype: string;
    konstruksjonstype: string;
    handtering: string;
    type: string;
}

export interface AvfallsMaterialeRow {
    plannedAmount: number;
    actualAmount: number;
    amountToFacility: number;
    amountToReuse: number;
    facility: string;
    id: string;
}

export interface WasteReport {
    gjelder: {
        tiltak: TiltakData;
        eiendom: EiendomData;
    },
    avfall: {
        ordinert: AvfallsMaterialeRow[];
        farlig: AvfallsMaterialeRow[];
    }
};

export interface WasteReportSlice {
    wasteReportForm: {
        wasteReport: WasteReport;
        setGjelder: (gjelder: WasteReport["gjelder"]) => void;
        setAvfall: (avfall: WasteReport["avfall"]) => void;
        removeAvfallRow: (id: string) => void;
        addAvfallRow: (id: string) => void;
        updateAvfallRow: (id: string, data: Partial<AvfallsMaterialeRow>) => void;
    }
}


/**
 * State handling all data related to waste report form
*/
export const createWasteReportFormSlice: StateCreator<WasteReportSlice> = (set) => ({
    wasteReportForm: {
        wasteReport: {
            gjelder: {
                tiltak: {
                    berortBRA: 0,
                    bygningstype: "",
                    konstruksjonstype: "",
                    handtering: "",
                    type: "",
                },
                eiendom: {
                    address: "",
                    postalCode: "",
                    postalPlace: "",
                },
            },
            avfall: {
                ordinert: [],
                farlig: [],
            }
        },
        setGjelder: (gjelder: WasteReport["gjelder"]) => set((state) => ({ ...state, wasteReportForm: {...state.wasteReportForm, wasteReport: { ...state.wasteReportForm.wasteReport, gjelder } }})),
        setAvfall: (avfall: WasteReport["avfall"]) => set((state) => ({ ...state, wasteReportForm: {...state.wasteReportForm, wasteReport: { ...state.wasteReportForm.wasteReport, avfall } }})),
        removeAvfallRow: (id: string) => set((state) => {
            const ordinert = state.wasteReportForm.wasteReport.avfall.ordinert.filter((i) => i.id !== id);
            const farlig = state.wasteReportForm.wasteReport.avfall.farlig.filter((i) => i.id !== id);
            return { ...state, wasteReportForm: {...state.wasteReportForm,  wasteReport: { ...state.wasteReportForm.wasteReport, avfall: { ordinert, farlig } } }}
        }),
        addAvfallRow: (id: string) => set((state) => {
            const material = WASTE_MATERIALS.find((i) => i.id === id);
            if (!material) return state;
            if (material.dangerous === true) {
                return { ...state, wasteReportForm: {...state.wasteReportForm,  wasteReport: { ...state.wasteReportForm.wasteReport, avfall: { ordinert: state.wasteReportForm.wasteReport.avfall.ordinert, farlig: [...state.wasteReportForm.wasteReport.avfall.farlig, { plannedAmount: 0, actualAmount: 0, amountToFacility: 0, amountToReuse: 0, facility: "", id }] } }} }
            } else {
                return { ...state, wasteReportForm: {...state.wasteReportForm,  wasteReport: { ...state.wasteReportForm.wasteReport, avfall: { farlig: state.wasteReportForm.wasteReport.avfall.farlig, ordinert: [...state.wasteReportForm.wasteReport.avfall.ordinert, { plannedAmount: 0, actualAmount: 0, amountToFacility: 0, amountToReuse: 0, facility: "", id }] } }} }
            }
        }),
        updateAvfallRow: (id: string, data: Partial<AvfallsMaterialeRow>) => set((state) => {
            const ordinert = state.wasteReportForm.wasteReport.avfall.ordinert.map((i) => i.id === id ? { ...i, ...data } : i);
            const farlig = state.wasteReportForm.wasteReport.avfall.farlig.map((i) => i.id === id ? { ...i, ...data } : i);
            return { ...state, wasteReportForm: {...state.wasteReportForm, wasteReport: { ...state.wasteReportForm.wasteReport, avfall: { ordinert, farlig } } }}
        })
    }
}); 