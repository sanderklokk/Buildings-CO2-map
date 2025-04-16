import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { get_detailed_building } from '../../../api/mapsearchAPI';


export const MapBuildingPopup = ({buildingid, coordinates}: {buildingid: number, 
    coordinates: {lat: number, long: number}}) => {

    const { data: buildingdata, isLoading, isError } = useQuery({queryKey: ["buildingdata", buildingid], queryFn: () => get_detailed_building(buildingid)});

    return (
        <Box>
            {isLoading && <Typography>Henter data...</Typography>}
            {isError && <Typography>Feil under henting av bygningsdata</Typography>}
            {buildingdata && (
                <>
               <Typography variant='h5' fontWeight={600}>
                    Bygg: {buildingdata.data.byggningsnr
                    }
                </Typography>
                <Typography>
                    Byggtype: {buildingdata.data.byggningstypekode}
                    lat {coordinates.lat} long {coordinates.long}
                </Typography>
                <Typography>
                    Bruksareal: {buildingdata.data.bruksarealtotalt}
                </Typography>
                </>
            )}
        </Box>
    );
}