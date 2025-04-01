import { AxiosResponse } from "axios";
import { service }  from "./config";
import { APIMaterialType } from "./models";


const MATERIAL_TYPES_GET_ALL = "api/materialtype/all";

export const get_all_materialtypes = async (): Promise<AxiosResponse<APIMaterialType[]>> => {
    return (await service.get(MATERIAL_TYPES_GET_ALL)).data;
}