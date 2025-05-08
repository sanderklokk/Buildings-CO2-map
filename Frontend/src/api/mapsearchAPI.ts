import { APIMapBuilding, APIDetailedBuilding } from "./models";
import { AxiosResponse } from "axios";
import { service } from "./config";
import { Area } from "../assets/data/areas";

export const GET_MATERIAL_IN_ALL_BUILDINGS = "api/bygning/bymaterial";

export const GET_DETAILED_BUILING = "api/bygning/bybygningsnr/";

export const GET_CLOSEST_BUILDING = "api/bygning/nearby";

export const GET_CLOSEST_BUILDING_MATERIALS = "api/bygning/nearbymaterial";

export const get_search_building_materials = async (
  materialid: string[],
  buildingtypes: string[],
  area: Area | undefined,
): Promise<AxiosResponse<APIMapBuilding[]>> => {
  return service.get(GET_MATERIAL_IN_ALL_BUILDINGS, {
    params: {
      materials: materialid.length > 0 ? materialid.join(",") : null,
      buildingtypes: buildingtypes.length > 0 ? buildingtypes.join(",") : null,
      limitarea: area != undefined ? 1 : 0,
      latstart: area == undefined ? null : area.latStart,
      longstart: area == undefined ? null : area.longStart,
      latend: area == undefined ? null : area.latEnd,
      longend: area == undefined ? null : area.longEnd,
    },
  });
};

export const get_detailed_building = async (
  buildingid: number,
): Promise<AxiosResponse<APIDetailedBuilding>> => {
  return service.get(GET_DETAILED_BUILING + buildingid);
};

export const get_closest_building = async (
  lat: number,
  lon: number,
): Promise<AxiosResponse<APIDetailedBuilding>> => {
  return service.get(GET_CLOSEST_BUILDING, {
    params: {
      lat: lon, // api handles lat long reversed
      lon: lat,
    },
  });
};

export const get_closest_building_materials = async (
  lat: number,
  lon: number,
): Promise<AxiosResponse<APIMapBuilding>> => {
  return service.get(GET_CLOSEST_BUILDING_MATERIALS, {
    params: {
      lat: lon, // api handles lat long reversed
      lon: lat,
    },
  });
};
