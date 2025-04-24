import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { get_address_search } from "../../api/geonorgeAPI";

//import { useBoundStore } from "../../store/Store";
import { AxiosResponse } from "axios";
import { APIPunktSok } from "../../api/models";
import { get_closest_building_materials } from "../../api/mapsearchAPI";
import { useBoundStore } from "../../store/Store";




const Hortigsok = () => {
  const [showDetailed, setShowDetailed] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchResult, setSearchResult] = useState<AxiosResponse<APIPunktSok> | null>();

  const { setHurtigSokResult, setBuildings } = useBoundStore().mapSlice;

  const [formInputs, setFormInputs] = useState({
    query: "",
    gardsnummer: "",
    bruksnummer: "",
    festenummer: "",
  });


  const toggleDetailed = () => {
    if (showDetailed) {
      setFormInputs((prev) => ({
        ...prev,
        gardsnummer: "",
        bruksnummer: "",
        festenummer: "",
      }));
  
    }
    setShowDetailed((prev) => !prev);

  };

  const handleSearch = async () => {
    setErrorMessage("");
    setHasSearched(true);
    try {
      
      setLoadingSearch(true);
      const res = await get_address_search({
        query: formInputs.query,
        count: 10,
        gardsnummer: formInputs.gardsnummer,
        bruksnummer: formInputs.bruksnummer,
        festenummer: formInputs.festenummer,
      });

      if (res.status === 200) {
        setSearchResult(res);
      }
      setLoadingSearch(false);

    } catch (error) {
      setLoadingSearch(false);
      setSearchResult(null);
      console.error("Error fetching address search results:", error);
    }
  
  };


  const handleSelectResult = async ({ lat, long }: { lat: number, long: number }) => {
    try {
      setBuildings([]);
      setErrorMessage("");
      const res = await get_closest_building_materials(lat, long);
      if (res.status === 200) {
        setHurtigSokResult(res.data);
      }
    } catch (error) {
      setHurtigSokResult(null);
      setErrorMessage("Feil: Valgt bygg er ikke registrert.");
      console.error("Error fetching building search results:", error);
    }
    setHasSearched(false);
  }


  return (
    <Box className="p-4">
      <TextField fullWidth label="Hurtigsøk på bygg" variant="outlined" value={formInputs.query} onChange={(e) => setFormInputs({ ...formInputs, query: e.target.value })} />

      <Box className="mt-2 flex justify-end">
        <Button
          variant="text"
          onClick={toggleDetailed}
          size="small"
          endIcon={
            showDetailed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
        >
          {showDetailed ? "Fjern felter" : "Detaljert søk"}
        </Button>
      </Box>

      {showDetailed && (
        <Box className="mt-2 flex justify-center items-start space-x-2">
          <TextField className="w-1/3" label="Gårdsnr" variant="outlined" value={formInputs.gardsnummer} onChange={(e) => setFormInputs({ ...formInputs, gardsnummer: e.target.value })} />
          <TextField className="w-1/3" label="Bruksnr" variant="outlined" value={formInputs.bruksnummer} onChange={(e) => setFormInputs({ ...formInputs, bruksnummer: e.target.value })} />
          <TextField className="w-1/3" label="Seksjonsnr" variant="outlined" value={formInputs.festenummer} onChange={(e) => setFormInputs({ ...formInputs, festenummer: e.target.value })} />
        </Box>
      )}

      <Box className="mt-4 mb-3">
        <Button variant="contained" fullWidth onClick={handleSearch}>
          Søk
        </Button>
      </Box>
      {hasSearched &&
        <>
          {
            searchResult?.data &&
            <Typography className="">
              Resultater ({searchResult?.data.metadata.totaltAntallTreff > 10 ? 10 : searchResult?.data.metadata.totaltAntallTreff})
            </Typography>
          }
          {
            searchResult?.data && searchResult?.data.adresser.length > 0 &&
            <Box display={"flex"} flexDirection={"column"} gap={1} p={1} overflow={"scroll"} maxHeight={"300px"} boxShadow={3} borderRadius={2} bgcolor={"white"}>{
              searchResult?.data.adresser.map((address, i) => (
                <Box key={i} borderBottom={"1px solid #ccc"} padding={1} >

                  <Typography>
                    {address.adressetekst}
                  </Typography>
                  <Typography>
                    {address.kommunenavn}
                  </Typography>
                  <Button sx={{ justifySelf: "flex-end" }} variant="outlined" size="small" className="mt-2" onClick={() => handleSelectResult({ lat: address.representasjonspunkt.lat, long: address.representasjonspunkt.lon })}>
                    Velg
                  </Button>
                </Box>



              ))}
            </Box>}
          {searchResult?.status != 200 &&
            <>
              <Typography className="">
                Resultater (0)
              </Typography>
              <Typography className="">
                Det oppsto en feil.
              </Typography>
            </>
          }
          {loadingSearch &&
            <>
              <Typography className="">
                Resultater
              </Typography>
              <Typography className="text-sm">
                Laster resultater...
              </Typography>
            </>
          }

        </>
      }
       {
            errorMessage &&
            <Typography className="mt-2 text-sm text-red-500">
              {errorMessage}
            </Typography>
          }
    </Box>
  );
};

export default Hortigsok;
