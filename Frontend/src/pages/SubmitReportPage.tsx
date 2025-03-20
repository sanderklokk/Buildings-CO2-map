import { Box, Button, FormControl, Typography } from "@mui/material";
import { GjelderForm } from "../components/submitwastereport/GjelderForm";
import { AvfallsplanForm } from "../components/submitwastereport/AvfallsplanForm";
import { useBoundStore } from "../store/Store";


export const SubmitReportPage = () => {
    const { wasteReport } = useBoundStore().wasteReportForm;

    const handleSubmit = () => {
        console.log(wasteReport);
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
