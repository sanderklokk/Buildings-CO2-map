import { AxiosResponse } from "axios";
import { service }  from "./config";
import { APIWasteReport, APIWasteReportOverviewList } from "./models";

const WASTE_REPORT_CREATE_PATH = "api/wastereport/create";

export const post_wastereport = async (data: APIWasteReport): Promise<AxiosResponse>  => {
    return await service.post(WASTE_REPORT_CREATE_PATH, data);
}

export const get_wastereports = async (page: number, count: number, searchTerm: string): Promise<AxiosResponse<APIWasteReportOverviewList>> => {
    const p = page < 1 ? 1 : page;
    const c = count < 1 ? 1 : count;
    const s = searchTerm || "";
    return await service.get(`api/wastereport/all?page=${p}&count=${c}&search=${s}`);
}