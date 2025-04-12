import { APIMapBuilding, APIDetailedBuilding } from "./models";
import { AxiosResponse } from "axios";
import { service } from "./config";

export const GET_MATERIAL_IN_ALL_BUILDINGS = "api/bygning/bymaterial";

export const GET_DETAILED_BUILING = "api/bygning/bybygningsnr/";

export const get_search_building_materials = async (materialid: number): Promise<AxiosResponse<APIMapBuilding[]>> => {

    return service.get(GET_MATERIAL_IN_ALL_BUILDINGS, {
        params: { material: materialid.toString() }
    });
}

export const get_detailed_building = async (buildingid: number): Promise<AxiosResponse<APIDetailedBuilding>> => {
    return service.get(GET_DETAILED_BUILING + buildingid);
}
