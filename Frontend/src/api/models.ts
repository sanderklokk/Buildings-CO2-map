export interface APIWasteReportMaterial {
    id: number | null;
    materiale: number;
    planlagtmengde: number;
    faktiskmengde: number;
    mengdetilgjenbruk: number;
    mengdetilanlegg: number;
    anlegg: string;
    totalmengde: number;
}


export interface APIWasteReport {
    id: number | null;
    bygning: number | null;
    dato: string;
    address: string;
    postalcode: number;
    postalplace: string;
    berortbra: number;
    bygningstype: string;
    konstruksjonstype: string;
    handtering: string;
    type: string;
    materialer: APIWasteReportMaterial[];
}

export interface APIMaterialType {
    id: number | null;
    forelder: number | null;
    navn: string;
    farlig: boolean;
    synlig: boolean;
}

export interface APIWasteReportOverview {
    id: number,
    dato: string;
    address: string;
    postalcode: number;
    postalplace: string;
    berortbra: number;
    bygningstype: string;
    konstruksjonstype: string;
    handtering: string;
    type: string;
    totalmaterials: number;
}

export interface APIWasteReportOverviewList {
    total: number;
    results: APIWasteReportOverview[];
}

export interface APIWasteReportDetailedMaterial {
    id: number;
    planlagtmengde: number;
    faktiskmengde: number;
    mengdetilgjenbruk: number;
    mengdetilanlegg: number;
    anlegg: string;
    totalmengde: number;
    rapport: number;
    materiale: number;
    navn: string;
    forelder: number | null;
    farlig: boolean;
}

export type APIWasteReportDetailed = APIWasteReportOverview & {
    materialer: APIWasteReportDetailedMaterial[];
};
    

export interface APIMapBuilding {
    x: number; /* long */
    y: number; /* lat */
    building: number; /* building id */
    totalamount: number; /*heatmap intensity */
}

export interface APIDetailedBuilding {
    bygnignsnr: number;
    bygningsstatuskode: string;
    kommune: number;
    bygningstypekode: number;
    antalletasjer: number;
    bebygdareal: number;
    bruksarealtotalt: number;
    bruksarealbolig: number;
    bruksarealannet: number;
    bygdDato: string;
}