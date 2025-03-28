import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Hortigsok: React.FC = () => {
  const [showDetailed, setShowDetailed] = useState(false);

  const toggleDetailed = () => {
    setShowDetailed((prev) => !prev);
  };

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
          <TextField className="w-1/3" label="Gårdsnr" variant="outlined" />
          <TextField className="w-1/3" label="Bruksnr" variant="outlined" />
          <TextField className="w-1/3" label="Seksjonsnr" variant="outlined" />
        </Box>
      )}

      <Box className="mt-4">
        <Button variant="contained" fullWidth>
          Søk
        </Button>
      </Box>
    </Box>
  );
};

export default Hortigsok;
