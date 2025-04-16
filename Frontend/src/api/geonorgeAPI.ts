import { APIPunktSok } from "./models";
import { AxiosResponse } from "axios";
import { service } from "./config";

export const GET_ADDRESS_FROM_COORDINATES = "https://ws.geonorge.no/adresser/v1/punktsok";

export const get_address_from_coordinates = async (lat: number, long: number, radius=10): Promise<AxiosResponse<APIPunktSok>> => {
    return service.get(GET_ADDRESS_FROM_COORDINATES, {
        params: { lat: lat, lon: long, radius },
    });
}