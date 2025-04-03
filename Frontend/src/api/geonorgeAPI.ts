import { AxiosResponse } from "axios";
import { service }  from "./config";

const POST_ADDRESS_SEARCH = "https://ws.geonorge.no/adresser/v1/sok";

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


export const get_address_search = async (params: APIAddressSearchParameters): Promise<AxiosResponse<APIAddressSearchResult>>  => {
    if (!params.query && !params.gardsnummer && !params.bruksnummer && !params.festenummer) {
        throw new Error("Ingen søkestreng oppgitt");
    }

    return await service.get(POST_ADDRESS_SEARCH, {params: {
        sok: params.query,
        treffPerSide: params.count,
        gardsnummer: params.gardsnummer || null,
        bruksnummer: params.bruksnummer || null,
        festenummer: params.festenummer || null,
        fuzzy: true,
    }});
}