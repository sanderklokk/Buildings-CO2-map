import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Map } from "./Map";

import { DataTextView } from "./DataTextView";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MapTextTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", flexGrow: "1", display: "flex", flexDirection: "column" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Map and Text Tabs"
        centered
      >
        <Tab label="Kartvisning" {...a11yProps(0)} />
        <Tab label="Tekstvisning" {...a11yProps(1)} />
      </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
      {value === 0 && <Map />}
      {value === 1 && <DataTextView />}
      </Box>
    </Box>
  );
}
