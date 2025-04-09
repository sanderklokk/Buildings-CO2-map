import { AxiosResponse } from "axios";
import { service }  from "./config";
import { APIMaterialType } from "./models";


const MATERIAL_TYPES_GET_ALL = "api/materialtype/all";

const MATERIAL_TYPES_CREATE = "api/materialtype/create";

const MATERIAL_TYPES_UPDATE = "api/materialtype/update";

const MATERIAL_TYPES_DELETE = "api/materialtype/delete";

// Array of materialtyper
export const get_all_materialtypes = async (): Promise<AxiosResponse<APIMaterialType[]>> => {
    return service.get(MATERIAL_TYPES_GET_ALL);
}

// Uses APIMaterialType without id, returns same body with id
export const create_materialtype = async (materialtype: APIMaterialType): Promise<AxiosResponse<APIMaterialType>> => {
    return service.post(MATERIAL_TYPES_CREATE, materialtype);
}

// Uses APIMaterialType with id, returns updated instance
export const update_materialtype = async (materialtype: APIMaterialType): Promise<AxiosResponse<APIMaterialType>> => {
    return service.put(MATERIAL_TYPES_UPDATE, materialtype);
}

// Uses Id, returns all impacted materialtypes so they can be updated in local state
export const delete_materialtype = async (id: string): Promise<AxiosResponse<APIMaterialType[]>> => {
    return service.delete(MATERIAL_TYPES_DELETE, { data: { id } });
}
