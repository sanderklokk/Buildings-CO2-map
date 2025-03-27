import { Box, Button, FormControl, Typography } from "@mui/material";
import { GjelderForm } from "../components/submitwastereport/GjelderForm";
import { AvfallsplanForm } from "../components/submitwastereport/AvfallsplanForm";
import { useBoundStore } from "../store/Store";
import { post_wastereport } from "../api/wastereportAPI";
import { APIWasteReport, APIWasteReportMaterial } from "../api/models";
import { AvfallsMaterialeRow, WasteReport } from "../store/wastereportFormSlice";


export const SubmitReportPage = () => {
    const { wasteReport } = useBoundStore().wasteReportForm;

    const toApiMaterial = (material: AvfallsMaterialeRow): APIWasteReportMaterial => ({
        id: null,
        materiale: Number(material.id),
        planlagtmengde: material.plannedAmount,
        faktiskmengde: material.actualAmount,
        mengdetilgjenbruk: material.amountToReuse,
        mengdetilanlegg: material.amountToFacility,
        anlegg: material.facility,
        totalmengde: 0,
    });

    const toApiReport = (report: WasteReport): APIWasteReport => ({ 
        id: null,
        bygning: null,
        dato: new Date().toISOString(),
        address: report.gjelder.eiendom.address,
        postalcode: Number(report.gjelder.eiendom.postalCode),
        postalplace: report.gjelder.eiendom.postalPlace,
        berortbra: report.gjelder.tiltak.berortBRA,
        bygningstype: report.gjelder.tiltak.bygningstype,
        konstruksjonstype: report.gjelder.tiltak.konstruksjonstype,
        handtering: report.gjelder.tiltak.handtering,
        type: report.gjelder.tiltak.type,
        materialer: [],
    });
    
    const handleSubmit = async () => {
        const wastematerials: APIWasteReportMaterial[] = wasteReport.avfall.farlig.concat(wasteReport.avfall.ordinert).map(toApiMaterial); 
        const data: APIWasteReport = {...toApiReport(wasteReport), materialer: wastematerials};
    
        const res = await post_wastereport(data);
        console.log(res);

    }

    return <Box width={"100%"} flexGrow={1} maxWidth={"1200px"} mx={"auto"} display={"flex"} flexDirection={"column"} alignContent={"start"} marginBottom={10}>
        <FormControl fullWidth>

            <Box marginX={5}>
                <Typography variant="h4" marginBottom={3}>
                    Registrer avfallsrapport
                </Typography>
                <Box>
                    <Typography variant="h5" fontWeight={"bold"}>
                        Planen gjelder
                    </Typography>
                    <GjelderForm />
                </Box>
                <Box marginTop={4}>
                    <Typography variant="h5" fontWeight={"bold"}>
                        Detaljert avfallsplan
                    </Typography>
                    <AvfallsplanForm />
                </Box>
                <Button onClick={handleSubmit} variant="contained" color="primary" size="large" className="w-[200px]" sx={{ marginTop: 5 }}>
                    Send inn
                </Button>
            </Box>

        </FormControl>
    </Box>
};
