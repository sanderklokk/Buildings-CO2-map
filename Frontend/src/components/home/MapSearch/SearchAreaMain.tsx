import React, { useState } from "react";
import { Box, Tabs, Tab, TextField, Button } from "@mui/material";

const SearchAreaMain = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailed, setShowDetailed] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const toggleDetailed = () => {
    setShowDetailed((prev) => !prev);
  };

  return (
    <Box className="p-4">
      {/* Tabs for Byggsøk og Områdesøk */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Byggsøk" />
        <Tab label="Områdesøk" />
      </Tabs>

      {activeTab === 0 && (
        <Box className="mt-4">
          <TextField fullWidth label="Hurtigsøk på bygg" variant="outlined" />

          <Box className="mt-2">
            <Button variant="text" onClick={toggleDetailed} size="small">
              {showDetailed ? "Fjern felter" : "Detaljert søk"}
            </Button>
          </Box>

          {showDetailed && (
            <Box className="mt-2 flex space-x-2">
              <TextField fullWidth label="Gårdsnr" variant="outlined" />
              <TextField fullWidth label="Bruksnr" variant="outlined" />
              <TextField fullWidth label="Seksjonsnr" variant="outlined" />
            </Box>
          )}

          <Box className="mt-4">
            <Button variant="contained" fullWidth>
              Søk
            </Button>
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box className="mt-4">
          {/* GUI for Områdesøk – kan utvides senere */}
          <TextField
            fullWidth
            label="Områdesøk (GUI placeholder)"
            variant="outlined"
          />
          <Box className="mt-4">
            <Button variant="contained" fullWidth>
              Søk
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchAreaMain;
