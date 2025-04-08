export interface APIWasteReportMaterial {
    id: string | null;
    materiale: string;
    planlagtmengde: number;
    faktiskmengde: number;
    mengdetilgjenbruk: number;
    mengdetilanlegg: number;
    anlegg: string;
    totalmengde: number;
}


export interface APIWasteReport {
    id: string | null;
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
    id: string;
    forelder: string | null;
    navn: string;
    farlig: boolean;
    synlig: boolean;
}

export interface APIWasteReportOverview {
    id: string,
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
    id: string;
    planlagtmengde: number;
    faktiskmengde: number;
    mengdetilgjenbruk: number;
    mengdetilanlegg: number;
    anlegg: string;
    totalmengde: number;
    rapport: number;
    materiale: number;
    navn: string;
    forelder: string | null;
    farlig: boolean;
}

export type APIWasteReportDetailed = APIWasteReportOverview & {
    materialer: APIWasteReportDetailedMaterial[];
};
    