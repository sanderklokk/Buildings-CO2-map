import { Box, Button, FormControl, Snackbar, Typography } from "@mui/material";
import { GjelderForm } from "../components/submitwastereport/GjelderForm";
import { AvfallsplanForm } from "../components/submitwastereport/AvfallsplanForm";
import { useBoundStore } from "../store/Store";
import { post_wastereport } from "../api/wastereportAPI";
import { APIWasteReport, APIWasteReportMaterial } from "../api/models";
import { AvfallsMaterialeRow, WasteReport } from "../store/wastereportFormSlice";
import { useState } from "react";
import { isAxiosError } from "axios";
import { Alert } from "@mui/material";
import { AlertColor, AlertPropsColorOverrides } from "@mui/material/Alert";
import { OverridableStringUnion } from "@mui/types";
import { BuildingForm } from "../components/submitwastereport/BuildingForm";


interface SnackbarData {
    show: boolean;
    message: string;
    color: string;
    severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides> | undefined;
}

export const SubmitReportPage = () => {
    const { wasteReport } = useBoundStore().wasteReportForm;

    const [snackbarData, setSnackbarData] = useState({ show: false, message: "", color: "#000000", severity: "success" } as SnackbarData);

    const toApiMaterial = (material: AvfallsMaterialeRow): APIWasteReportMaterial => ({
        id: null,
        materiale: material.id,
        planlagtmengde: material.plannedAmount,
        faktiskmengde: material.actualAmount,
        mengdetilgjenbruk: material.amountToReuse,
        mengdetilanlegg: material.amountToFacility,
        anlegg: material.facility,
        totalmengde: 0,
    });

    const toApiReport = (report: WasteReport): APIWasteReport => ({
        id: null,
        bygning: report.bygning,
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
        const data: APIWasteReport = { ...toApiReport(wasteReport), materialer: wastematerials };


        try {
            await post_wastereport(data);
            setSnackbarData({ show: true, message: "Rapport sent inn", color: "#00FF00", severity: "success" });
        } catch (err: unknown) {
            if (isAxiosError(err) && err.response) {
                const res = err.response;

                if (res.status === 400) {
                    setSnackbarData({ show: true, message: "Rapporten mangler felter", color: "#660000", severity: "error" });
                } else if (res.status === 500) {
                    setSnackbarData({ show: true, message: "Serverfeil", color: "#FF0000", severity: "error" });
                } else {
                    setSnackbarData({ show: true, message: "Ukjent feil", color: "#FF0000", severity: "error" });
                }
            } else {
                setSnackbarData({ show: true, message: "Ukjent feil", color: "#FF0000", severity: "error" });
            }

        }
    };




        return <Box width={"100%"} mt={5} flexGrow={1} maxWidth={"1200px"} mx={"auto"} display={"flex"} flexDirection={"column"} alignContent={"start"} marginBottom={10}>
            <FormControl fullWidth>

                <Box marginX={5}>
                    <Typography variant="h4" marginBottom={3}>
                        Registrer avfallsrapport
                    </Typography>
                    <Box>
                    <Typography variant="h5" fontWeight={"bold"}>
                            Bygning
                        </Typography>
                        <BuildingForm />
                    </Box>
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
                    <Button onClick={handleSubmit} data-testid={"form-submit-btn"} variant="contained" color="primary" size="large" className="w-[200px]" sx={{ marginTop: 5 }}>
                        Send inn
                    </Button>
                </Box>

            </FormControl>
            
                 <Snackbar 
                open={snackbarData.show} 
                autoHideDuration={5000} 
                onClose={() => setSnackbarData({ show: false, message: "", color: "#000000", severity: "success" })}
                >
                <Alert
                onClose={() => setSnackbarData({ show: false, message: "", color: "#000000", severity: "success" })}
                severity={snackbarData.severity}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {snackbarData.message}
              </Alert>
              </Snackbar>
            
        </Box>
    };
