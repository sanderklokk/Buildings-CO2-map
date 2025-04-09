import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useQuery } from "@tanstack/react-query";
import { APIAddressSearchParameters, get_address_search } from "../../api/geonorgeAPI";
import { useBoundStore } from "../../store/Store";




const Hortigsok = () => {
  const [showDetailed, setShowDetailed] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { setHurtigsokResult } = useBoundStore().mapSearch;

  const [searchParams, setSearchParams] = useState<APIAddressSearchParameters>({
    query: "",
    count: 10,
    gardsnummer: "",
    bruksnummer: "",
    festenummer: "",
  });

  const [formInputs, setFormInputs] = useState({
    query: "",
    gardsnummer: "",
    bruksnummer: "",
    festenummer: "",
  });


  const toggleDetailed = () => {
    if (showDetailed) {

      setSearchParams({
        query: searchParams.query,
        count: searchParams.count,
        gardsnummer: "",
        bruksnummer: "",
        festenummer: "",
      });
    }
    setShowDetailed((prev) => !prev);

  };

  const { data, error, isLoading } = useQuery({ queryKey: ['addressSearch', searchParams], queryFn: () => get_address_search(searchParams) });

  const handleSearch = () => {
    setSearchParams({
      query: formInputs.query,
      count: searchParams.count,
      gardsnummer: formInputs.gardsnummer,
      bruksnummer: formInputs.bruksnummer,
      festenummer: formInputs.festenummer,
    });
    setHasSearched(true);
  };


  const handleSelectResult = ({ lat, long }: { lat: number, long: number }) => {
    setHurtigsokResult({ lat, lon: long });
    setHasSearched(false);
  }


  return (
    <Box className="p-4">
      <TextField fullWidth label="Hurtigsøk på bygg" variant="outlined" />

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

      <Box className="mt-4">
        <Button variant="contained" fullWidth>
          Søk
        </Button>
      </Box>
      {hasSearched &&
        <>
          {
            data?.data &&
            <Typography className="">
              Resultater ({data?.data.metadata.totaltAntallTreff > 10 ? 10 : data?.data.metadata.totaltAntallTreff})
            </Typography>
          }
          {
            data?.data && data?.data.adresser.length > 0 &&
            <Box display={"flex"} flexDirection={"column"} gap={1} p={1} overflow={"scroll"} maxHeight={"300px"} boxShadow={3} borderRadius={2} bgcolor={"white"}>{
              data?.data.adresser.map((address, i) => (
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
          {error &&
            <>
              <Typography className="">
                Resultater (0)
              </Typography>
              <Typography className="">
                Det oppsto en feil.
              </Typography>
            </>
          }
          {isLoading &&
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
    </Box>
  );
};

export default Hortigsok;
