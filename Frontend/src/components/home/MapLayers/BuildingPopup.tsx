import { APICoordinatesBuildingSearchResult } from "../../../api/mapsearchAPI";
import { Box, Typography } from "@mui/material";

export const BuildingPopup = ({ data }: { data: APICoordinatesBuildingSearchResult }) => {
    return <Box>
        <Box>
            <Typography variant="h6" fontWeight={600}>
                Bygning
            </Typography>
            <Typography>
                Bygningsnr: {data.bygningsnr}
            </Typography>
            <Typography>
                Bygningsstatuskode: {data.bygningsstatuskode}
            </Typography>
            <Typography>
                Etasjer: {data.antalletasjer}
            </Typography>
            <Typography>
                Bygget: {data.bygdDato}
            </Typography>
        </Box>
        <Box>
            <Typography variant="h6" fontWeight={600}>
                Materialer
            </Typography>
            {data.materialer.map((material, index) => (
                    <Typography key={index}>
                        {material.navn}: {material.mengde}t
                    </Typography>

            ))} 


        </Box>
    </Box>
}