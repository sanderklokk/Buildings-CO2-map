import { service }  from "./config";
import { APIWasteReport } from "./models";

const WASTE_REPORT_CREATE_PATH = "api/wastereport/create";

export const post_wastereport = async (data: APIWasteReport): Promise<Response>  => {
    return await service.post(WASTE_REPORT_CREATE_PATH, data);
}