import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { get_detailed_building } from '../../../api/mapsearchAPI';
import { get_address_from_coordinates } from '../../../api/geonorgeAPI';
import { APIMapBuilding } from '../../../api/models';


export const MapBuildingPopup = ({ building, coordinates }: {
    building: APIMapBuilding,
    coordinates: { lat: number, long: number }
}) => {

    const { data: buildingdata, isLoading, isError } = useQuery({ queryKey: ["buildingdata", building.building], queryFn: () => get_detailed_building(building.building) });
    const { data: addressdata, isLoading: addressLoading, isError: addressError } = useQuery({ queryKey: ["addressdata", coordinates], queryFn: () => get_address_from_coordinates(coordinates.long, coordinates.lat) });

    if (isLoading) {
        return <Box>
            <Typography>Henter data...</Typography>
        </Box>
    }
    if (isError) {
        return <Box>
            <Typography>Feil under henting av bygningsdata</Typography>
        </Box>
    }

    return (
        <Box flex={1} display='flex' flexDirection='column' gap={0}>
            {addressLoading && <Typography>Henter adresse...</Typography>}
            {addressError && <Typography>Ukjent addresse</Typography>}
            {addressdata && (addressdata.data.metadata.totaltAntallTreff > 0 ?
                <Typography variant='h5' fontWeight={600}>
                    {addressdata.data.adresser[0].adressetekst}
                </Typography>
                : <Typography variant='h5' fontWeight={600}>
                    Ukjent addresse
                </Typography>
            )}
            {buildingdata && (
                <>
                    <Typography style={{margin: 0}} margin={0} padding={0}>
                        Materialmengde: {building.totalamount} tonn
                    </Typography>
                    <Typography style={{margin: 0}} margin={0} padding={0}>
                        Bruksareal: {buildingdata.data.bruksarealtotalt}
                    </Typography>
                </>
            )}
        </Box>
    );
}