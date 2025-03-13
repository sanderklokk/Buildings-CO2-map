import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Hortigsok from "../SearchComponents/Hortigsok";
import Omradesok from "../SearchComponents/Omradesok";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SearchTypeTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      {/* Tabs-container */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="search-type-tab"
          centered
        >
          <Tab
            label="Byggsøk"
            {...a11yProps(0)}
            sx={{
              textTransform: "none",
              "&.Mui-selected": {
                backgroundColor: "var(--color-trk-deep-blue)",
                color: "var(--color-trk-white)",
              },
            }}
          />
          <Tab
            label="Områdesøk"
            {...a11yProps(1)}
            sx={{
              textTransform: "none",
              "&.Mui-selected": {
                backgroundColor: "var(--color-trk-deep-blue)",
                color: "var(--color-trk-white)",
              },
            }}
          />
        </Tabs>
      </Box>

      {/* Panel for Byggsøk */}
      <CustomTabPanel value={value} index={0}>
        <Hortigsok />
      </CustomTabPanel>

      {/* Panel for Områdesøk */}
      <CustomTabPanel value={value} index={1}>
        <Omradesok />
      </CustomTabPanel>
    </Box>
  );
}
