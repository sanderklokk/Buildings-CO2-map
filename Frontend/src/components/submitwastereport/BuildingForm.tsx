import { Box, Button, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { get_address_search } from "../../api/geonorgeAPI";
import { APIAdresseSok, APIDetailedBuilding } from "../../api/models";
import { useBoundStore } from "../../store/Store";
import { get_closest_building } from "../../api/mapsearchAPI";



export const BuildingForm = () => {

    const [addressInput, setAddressInput] = useState<string>("");
    const [performSearch, setPerformSearch] = useState<boolean>(false);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    const { setBygning } = useBoundStore().wasteReportForm;

    const [selectedBuilding, setSelectedBuilding] = useState<APIDetailedBuilding | null>(null);

    const { data: addressResults, isLoading, error } = useQuery({
        queryKey: ["addressearch", addressInput],
        queryFn: () => get_address_search({ query: addressInput, count: 5 }),
        enabled: performSearch,
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPerformSearch(false);
        setAddressInput(e.target.value);
    }

    const handleSearch = () => {
        setPerformSearch(true);
    }

    const handleSelectAddress = async (address: APIAdresseSok["adresser"][number]) => {
        setPerformSearch(false);
        try {
            const res = await get_closest_building(address.representasjonspunkt.lat, address.representasjonspunkt.lon);
            if (res.status != 200) {
                throw new Error("kunne ikke hente bygg");
            } else {
                setBygning(res.data.byggningsnr);
                setSelectedBuilding(res.data);
                setSelectedAddress(address.adressetekst);
            }
        } catch (e) {
            console.error(e);
            setSelectedAddress(null);
        }
    }

    const handleRemoveAddress = () => {
        setSelectedAddress(null);
        setBygning(null);
    }

    return <Box marginBottom={2}>
        <Typography marginTop={2} fontSize={20} marginBottom={2}>
            Søk etter bygning
        </Typography>
        <Box display={"flex"} gap={3} alignItems={"start"} >
            <TextField required name="addressinput" label="Adresse" type="text" className="w-[200px] mx-auto" placeholder="Adresse" variant="filled" value={addressInput} onChange={handleSearchChange} />
            <Button variant="contained" color="primary" size="medium" onClick={handleSearch} className="self-center">Søk</Button>
        </Box>
        {
            performSearch && (
                <Box marginTop={2} display={"flex"} flexDirection={"column"} gap={2}>
                    <Typography marginTop={2} fontSize={18} >
                        Resultater
                    </Typography>
                    {addressResults && <Box>
                        {isLoading && <Typography>Loading...</Typography>}
                        {error && <Typography>Feil ved henting av adresser</Typography>}
                        {addressResults.data && addressResults.data.adresser.map((v) =>
                            <Box flex={1} my={1} flexDirection={"row"}><Button className="" size="small" variant="outlined" onClick={() => handleSelectAddress(v)}>Velg</Button><Typography className="inline" ml={2}>{v.adressetekst}</Typography></Box>
                        )}
                        {addressResults.data && addressResults.data.adresser.length === 0 && <Typography>Ingen adresser funnet</Typography>}
                    </Box>}

                </Box>
            )
        }
        { selectedAddress != null && selectedBuilding != null && <Box gap={2} flex={1} mt={2} flexDirection={"row"}>
            <Typography className="inline self-center" mr={1} fontSize={18}  >
                Valgt adresse: 
            </Typography>  
            <Typography className="inline self-center"  fontSize={18} mr={2} >
                {selectedAddress} ({selectedBuilding.bygdDato}, #{selectedBuilding.byggningsnr})
            </Typography> 
            <Button variant="outlined" size="small" onClick={handleRemoveAddress}  className="self-center">Fjern</Button>
            </Box>}

    </Box>
}