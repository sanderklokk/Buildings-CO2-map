import React, { useState } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import { SelectChangeEvent } from "@mui/material/Select";

// Demo-data
const byggtypeOptions = ["Byggtype 1", "Byggtype 2", "Byggtype 3"];
const omradeOptions = ["Område 1", "Område 2", "Område 3"];
const materialOptions = ["Material 1", "Material 2", "Material 3"];
const subMaterialOptions = [
  "Underkategori 1",
  "Underkategori 2",
  "Underkategori 3",
];

const Omradesok: React.FC = () => {
  const [byggtype, setByggtype] = useState<string[]>([]);
  const [omrade, setOmrade] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSubMaterials, setSelectedSubMaterials] = useState<string[]>(
    []
  );

  const handleByggtypeChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setByggtype(typeof value === "string" ? value.split(",") : value);
  };

  const handleOmradeChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setOmrade(typeof value === "string" ? value.split(",") : value);
  };

  const handleMaterialChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newMaterials = typeof value === "string" ? value.split(",") : value;
    setSelectedMaterials(newMaterials);

    // Når Material 2 fjernes, tøm også undermaterialer
    if (!newMaterials.includes("Material 2")) {
      setSelectedSubMaterials([]);
    }
  };

  const handleSubMaterialChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSubMaterials(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const clearByggtype = () => {
    setByggtype([]);
  };

  const clearOmrade = () => {
    setOmrade([]);
  };

  const clearMaterial = () => {
    setSelectedMaterials([]);
    setSelectedSubMaterials([]); // Tøm også undermaterialer
  };

  const clearSubMaterial = () => {
    setSelectedSubMaterials([]);
  };

  return (
    <Box className="w-[80%] p-4 mx-auto space-y-8">
      {/* Byggtype multi-select */}
      <Box>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="byggtype-label">Byggtype</InputLabel>
          <Select
            labelId="byggtype-label"
            multiple
            value={byggtype}
            onChange={handleByggtypeChange}
            input={<OutlinedInput label="Byggtype" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            label="Byggtype"
          >
            {byggtypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
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

      {/* Område multi-select med "Tegn område"-knapp */}
      <Box>
        <Box className="flex items-center space-x-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="omrade-label">Område</InputLabel>
            <Select
              labelId="omrade-label"
              multiple
              value={omrade}
              onChange={handleOmradeChange}
              input={<OutlinedInput label="Område" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              label="Område"
            >
              {omradeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Tegn område
          </Button>
        </Box>
        {omrade.length > 0 && (
          <Box className="flex justify-end mt-2">
            <Button variant="text" onClick={clearOmrade}>
              Fjern filter
            </Button>
          </Box>
        )}
      </Box>

      {/* Materialtype multi-select */}
      <Box>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="materialtype-label">Materialtype</InputLabel>
          <Select
            labelId="materialtype-label"
            multiple
            value={selectedMaterials}
            onChange={handleMaterialChange}
            input={<OutlinedInput label="Materialtype" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            label="Materialtype"
          >
            {materialOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
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

      {/* Undermaterialer for Material 2 */}
      {selectedMaterials.includes("Material 2") && (
        <Box className="space-y-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="sub-material-label">Underkategori</InputLabel>
            <Select
              labelId="sub-material-label"
              multiple
              value={selectedSubMaterials}
              onChange={handleSubMaterialChange}
              input={<OutlinedInput label="Underkategori" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              label="Underkategori"
            >
              {subMaterialOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSubMaterials.length > 0 && (
            <Box className="flex justify-end mt-2">
              <Button variant="text" onClick={clearSubMaterial}>
                Fjern filter
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Søk-knapp nederst */}
      <Box>
        <Button variant="contained" fullWidth>
          Søk
        </Button>
      </Box>
    </Box>
  );
};

export default Omradesok;
