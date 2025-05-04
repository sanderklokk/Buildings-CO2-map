import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Button,
} from "@mui/material";
{/*import EditIcon from "@mui/icons-material/Edit";*/}
import { SelectChangeEvent } from "@mui/material/Select";
import { useBoundStore } from "../../store/Store";
import { useQuery } from "@tanstack/react-query";
import { get_all_materialtypes } from "../../api/materialtypeAPI";
import { get_search_building_materials } from "../../api/mapsearchAPI";
import { BUILDINGCODES } from "../../assets/data/buildingcodes";
import { AREAS } from "../../assets/data/areas";

const Omradesok = () => {

  const { setBuildings, buildings, setHurtigSokResult } = useBoundStore().mapSlice;
  const [byggtype, setByggtype] = useState<string[]>([]);
  const [omrade, setOmrade] = useState<string | undefined>(undefined);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  
  const { data: materialOptions, isLoading: materialsLoading, isError: materialsError} = useQuery({queryKey: ["materials"], queryFn: () => get_all_materialtypes(true)});

  const handleByggtypeChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setByggtype(typeof value === "string" ? value.split(",") : value);
  };

  const handleOmradeChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setOmrade(value);
  };

  const handleMaterialChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newMaterials = typeof value === "string" ? value.split(",") : value;
    setSelectedMaterials(newMaterials);

  };

  const clearByggtype = () => {
    setByggtype([]);
  };

  const clearOmrade = () => {
    setOmrade(undefined);
  };

  const clearMaterial = () => {
    setSelectedMaterials([]);
  };

  const handleSearch = async () => {
    try {
      setHurtigSokResult(null);
      const area = omrade == undefined ? undefined : AREAS.find(x => x.id == Number(omrade));
      const res = await get_search_building_materials(selectedMaterials, byggtype, area);
      if (res.status === 200) {
        setBuildings(res.data);
      } else {
        setBuildings([]);
        console.error("Error fetching building materials");
      }
    } catch (error) {
      setBuildings([]);
    
      console.error("Error fetching building materials", error);
    }

    console.log(buildings)
  }

  return (
    <Box className="p-4 space-y-8">
      <Box>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="byggtype-label">Byggtype</InputLabel>
          <Select
            data-testid="byggtype-select"
            labelId="byggtype-label"
            multiple
            value={byggtype}
            onChange={handleByggtypeChange}
            input={<OutlinedInput label="Byggtype" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => {
               //   const type  = BUILDINGCODES.find(x => x.id == value);
               //   if (!type) return <></>
                  return <Chip key={value} label={value} />
            })}
              </Box>
            )}
            label="Byggtype"
          >
            {BUILDINGCODES.sort((a, b) => a.id.localeCompare(b.id)) .map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.id} {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {byggtype.length > 0 && (
          <Box className="flex justify-end mt-2">
            <Button variant="text" onClick={clearByggtype}>
              Fjern filter
            </Button>
          </Box>
        )}
      </Box>

      <Box>
        <Box className="flex items-center space-x-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="omrade-label">Område</InputLabel>
            <Select
              data-testid="omrade-select"
              labelId="omrade-label"
              value={omrade || ""}
              onChange={handleOmradeChange}
              input={<OutlinedInput label="Område" />}
              label="Område"
            >
              {AREAS.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
         {/* <Button variant="outlined" startIcon={<EditIcon />}>
            Tegn område
          </Button>

         */}
        </Box>
        {omrade != undefined && (
          <Box className="flex justify-end mt-2">
            <Button variant="text" onClick={clearOmrade}>
              Fjern filter
            </Button>
          </Box>
        )}
      </Box>

      <Box>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="materialtype-label">Materialtype</InputLabel>
          <Select
            data-testid="materialtype-select"
            labelId="materialtype-label"
            multiple
            value={selectedMaterials}
            onChange={handleMaterialChange}
            input={<OutlinedInput label="Materialtype" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => {
                  const mat = materialOptions?.data.find(x => x.id == Number(value));
                  if (!mat) return <></>
                  return <Chip key={value} label={mat.navn} />
            })}
              </Box>
            )}
            label="Materialtype"
          >
            {materialsLoading && <MenuItem disabled>Laster...</MenuItem>}
            {materialsError && <MenuItem disabled>Feil under henting av materialvalg</MenuItem>}
            {materialOptions && materialOptions.data.map((option) => (option.id != null ?
              <MenuItem data-testid={"materialtype-option-"+option.id} key={option.id} value={option.id}>
                {option.navn}
              </MenuItem> : <></>
            ))}
          </Select>
        </FormControl>
        {selectedMaterials.length > 0 && (
          <Box className="flex justify-end mt-2">
            <Button variant="text" onClick={clearMaterial}>
              Fjern filter
            </Button>
          </Box>
        )}
      </Box>
      <Box>
        <Button data-testid="omradesok-sok-btn" variant="contained" fullWidth onClick={handleSearch}>
          Søk
        </Button>
      </Box>
    </Box>
  );
};

export default Omradesok;
