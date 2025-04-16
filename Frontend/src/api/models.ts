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
    latitude: number; /* lat */
    longitude: number; /* long */
    building: number; /* building id */
    totalamount: number; /*heatmap intensity */
}

export interface APIDetailedBuilding {
    byggningsnr: number;
    bygningstatuskode: string;
    kommuneId: number;
    byggningstypekode: number;  
    byggningstype: string;
    antallboenheter: number;
    antalletasjer: number;
    bebygdareal: number;
    bruksarealtotalt: number;   
    bruksarealbolig: number;
    bruksarealannet: number;
    bygdDato: string;

}
