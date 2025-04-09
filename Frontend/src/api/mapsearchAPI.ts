import { AxiosResponse } from "axios";
import { service }  from "./config";

const POST_ADDRESS_COORDINATES_SEARCH = "https://ws.geonorge.no/adresser/v1/sok";

const GET_BUILDING_BY_COORDINATES = "/api/map/building";

export interface APIAddressSearchParameters {
    query: string;
    count: number;
    gardsnummer?: string;
    bruksnummer?: string;
    festenummer?: string;
}

export interface APIAddressSearchResult {
    metadata: {
        totaltAntallTreff: number;
        sokeStreng: string;
    };
    adresser: {
        adressenavn: string;
        adressetekst: string;
        nummer: number;
        bokstav: string;
        kommunenummer: string;
        kommunenavn: string;
        gardsnummer: string;
        bruksnummer: string;
        festenummer: string;
        objtype: string;
        poststed: string;
        postnummer: string;
        representasjonspunkt: {
            epsg: string;
            lat: number;
            lon: number;
        }
    }[];
    
}

export interface APICoordinatesBuildingSearchResult {
    lon: number;
    lat: number;
    bygningsnr: number;
    bygningsstatuskode: string;
    kommune: number;
    bygningstypekode: number;   
    anntalboenheter: number;
    antalletasjer: number;
    bebygdareal: number;
    bruksarealtotalt: number;
    bruksarealbolig: number;
    bruksarealannet: number;
    bygdDato: string;
    materialer: [
        {
            id: number;
            navn: string;
            mengde: number;
            totalmengde: number;
        }
    ];
}

export const get_address_search = async (params: APIAddressSearchParameters): Promise<AxiosResponse<APIAddressSearchResult>>  => {
    if (!params.query && !params.gardsnummer && !params.bruksnummer && !params.festenummer) {
        throw new Error("Ingen søkestreng oppgitt");
    }

    return await service.get(POST_ADDRESS_COORDINATES_SEARCH, {params: {
        sok: params.query,
        treffPerSide: params.count,
        gardsnummer: params.gardsnummer || null,
        bruksnummer: params.bruksnummer || null,
        festenummer: params.festenummer || null,
        fuzzy: true,
    }});
}

export const get_building_search = async (params: {lat: number, lon: number}): Promise<AxiosResponse<APICoordinatesBuildingSearchResult>>  => {
    return await service.get(GET_BUILDING_BY_COORDINATES, {params: {
        lat: params.lat,
        lon: params.lon
    }});
}
