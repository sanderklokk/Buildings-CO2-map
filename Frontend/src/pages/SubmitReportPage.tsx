import { Box, FormControl, Typography } from "@mui/material";
import { EiendomData, GjelderForm, TiltakData } from "../components/submitwastereport/GjelderForm";
import { AvfallsplanForm } from "../components/submitwastereport/AvfallsplanForm";
import { AvfallsMaterialeRow } from "../components/submitwastereport/AvfallsMaterialeRow";

export interface WasteReport {
    gjelder: {
        tiltak: TiltakData;
        eiendom: EiendomData;
    },
    avfall: {
        ordinert: AvfallsMaterialeRow[];
        farlig: AvfallsMaterialeRow[];
    }
};

export const SubmitReportPage = () => {

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
            </Box>
        </FormControl>
    </Box>
};
