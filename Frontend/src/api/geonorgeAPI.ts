import { APIAdresseSok, APIPunktSok } from "./models";
import { AxiosResponse } from "axios";
import { service } from "./config";

export const GET_ADDRESS_FROM_COORDINATES =
  "https://ws.geonorge.no/adresser/v1/punktsok";

export const GET_COORDINATES_FROM_ADDRESS =
  "https://ws.geonorge.no/adresser/v1/sok";

export interface APIAdresseSokParameters {
  query: string;
  count: number;
  gardsnummer?: string;
  bruksnummer?: string;
  festenummer?: string;
}

export const get_address_from_coordinates = async (
  lat: number,
  long: number,
  radius = 10,
): Promise<AxiosResponse<APIPunktSok>> => {
  return service.get(GET_ADDRESS_FROM_COORDINATES, {
    params: { lat: lat, lon: long, radius },
  });
};

export interface AdresseSokParameters {
  query: string;
  count: number;
  gardsnummer?: string;
  bruksnummer?: string;
  festenummer?: string;
}

export const get_address_search = async (
  params: AdresseSokParameters,
): Promise<AxiosResponse<APIAdresseSok>> => {
  if (
    !params.query &&
    !params.gardsnummer &&
    !params.bruksnummer &&
    !params.festenummer
  ) {
    throw new Error("error: tomt søk");
  }

  return await service.get(GET_COORDINATES_FROM_ADDRESS, {
    params: {
      sok: params.query,
      treffPerSide: params.count,
      gardsnummer: params.gardsnummer || null,
      bruksnummer: params.bruksnummer || null,
      festenummer: params.festenummer || null,
      fuzzy: true,
    },
  });
};
