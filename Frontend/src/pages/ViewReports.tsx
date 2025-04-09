import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Slider,
  MenuItem,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import ReportCard from "../components/viewReports/ReportCard";
import { WasteReport } from "../../src/types/ReportTypes";
import MainLayout from "../components/layout/MainLayout";
import demoReports from "../../../Data/demoReports.json";

interface DemoReports {
  reports: WasteReport[];
}

interface ReportsSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: number[];
  onDateRangeChange: (event: Event, newValue: number | number[]) => void;
  buildingYearRange: number[];
  onBuildingYearRangeChange: (
    event: Event,
    newValue: number | number[]
  ) => void;
  applicationPurpose: string;
  onApplicationPurposeChange: (value: string) => void;
  braRange: number[];
  onBraRangeChange: (event: Event, newValue: number | number[]) => void;
  clearFilters: () => void;
  minDelivered: number;
  maxDelivered: number;
  minYear: number;
  maxYear: number;
  minBra: number;
  maxBra: number;
  purposeOptions: string[];
}

const ReportsSidebar = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  buildingYearRange,
  onBuildingYearRangeChange,
  applicationPurpose,
  onApplicationPurposeChange,
  clearFilters,
  minDelivered,
  maxDelivered,
  minYear,
  maxYear,
  braRange,
  onBraRangeChange,
  minBra,
  maxBra,
  purposeOptions,
}: ReportsSidebarProps) => {
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("no-NO", {
      month: "short",
      year: "numeric",
    });

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", p: 4 }}
    >
      <TextField
        label="Søk rapport"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Typography variant="subtitle1" gutterBottom>
        Tidsperiode: {formatDate(dateRange[0])} - {formatDate(dateRange[1])}
      </Typography>
      <Slider
        value={dateRange}
        onChange={onDateRangeChange}
        valueLabelDisplay="auto"
        min={minDelivered}
        max={maxDelivered}
        valueLabelFormat={formatDate}
        sx={{ mb: 3 }}
      />
      <Typography variant="subtitle1" gutterBottom>
        Byggår: {buildingYearRange[0]} - {buildingYearRange[1]}
      </Typography>
      <Slider
        value={buildingYearRange}
        onChange={onBuildingYearRangeChange}
        valueLabelDisplay="auto"
        min={minYear}
        max={maxYear}
        sx={{ mb: 3 }}
      />
      <TextField
        select
        label="Søknadsformål"
        variant="outlined"
        fullWidth
        value={applicationPurpose}
        onChange={(e) => onApplicationPurposeChange(e.target.value)}
        sx={{ mb: 3 }}
      >
        <MenuItem value="">Alle</MenuItem>
        {purposeOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Typography variant="subtitle1" gutterBottom>
        BRA (m²): {braRange[0]} - {braRange[1]}
      </Typography>
      <Slider
        value={braRange}
        onChange={onBraRangeChange}
        valueLabelDisplay="auto"
        min={minBra}
        max={maxBra}
        sx={{ mb: 3 }}
      />
      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={clearFilters}
        sx={{ mt: 2 }}
      >
        Fjern alle filter
      </Button>
    </Box>
  );
};

const ViewReports = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<number[]>([0, 0]);
  const [buildingYearRange, setBuildingYearRange] = useState<number[]>([0, 0]);
  const [braRange, setBraRange] = useState<number[]>([0, 0]);
  const [applicationPurpose, setApplicationPurpose] = useState("");
  const [purposeOptions, setPurposeOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Alle");

  useEffect(() => {
    const demoData = demoReports as DemoReports;
    setReports(demoData.reports);
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      const deliveredTimestamps = reports.map((r) =>
        new Date(r.deliveredDate).getTime()
      );
      const minDeliveredValue = Math.min(...deliveredTimestamps);
      const maxDeliveredValue = Math.max(...deliveredTimestamps);
      setDateRange([minDeliveredValue, maxDeliveredValue]);

      const years = reports.map((r) => r.buildingYear);
      const minYearValue = Math.min(...years);
      const maxYearValue = Math.max(...years);
      setBuildingYearRange([minYearValue, maxYearValue]);

      const bras = reports.map((r) => r.bra);
      const minBraValue = Math.min(...bras);
      const maxBraValue = Math.max(...bras);
      setBraRange([minBraValue, maxBraValue]);

      const allowedPurposes = [
        "Nybygg, påpygg mv.",
        "Rehabilitering",
        "Riving",
      ];
      const purposes = Array.from(
        new Set(
          reports
            .map((r) => r.applicationPurpose)
            .filter((purpose) => allowedPurposes.includes(purpose))
        )
      );
      setPurposeOptions(purposes);
    }
  }, [reports]);

  const filteredReports = reports.filter((r) => {
    const lowerSearch = searchTerm.toLowerCase();
    const deliveredTime = new Date(r.deliveredDate).getTime();
    const inDateRange =
      deliveredTime >= dateRange[0] && deliveredTime <= dateRange[1];
    const inYearRange =
      r.buildingYear >= buildingYearRange[0] &&
      r.buildingYear <= buildingYearRange[1];
    const inBraRange = r.bra >= braRange[0] && r.bra <= braRange[1];
    const matchesPurpose =
      applicationPurpose === "" || r.applicationPurpose === applicationPurpose;
    const matchesSearch =
      r.address.toLowerCase().includes(lowerSearch) ||
      r.id.toString().includes(lowerSearch) ||
      r.usageNumber.toLowerCase().includes(lowerSearch) ||
      r.responsible.toLowerCase().includes(lowerSearch) ||
      r.caseHandler.toLowerCase().includes(lowerSearch);
    return (
      inDateRange &&
      inYearRange &&
      inBraRange &&
      matchesPurpose &&
      matchesSearch
    );
  });

  const reportsInTab = filteredReports.filter((r) => {
    if (activeTab === "Alle") return true;
    return r.status === activeTab;
  });

  const handleViewReport = (id: number) => {
    alert(`Viser rapport med ID: ${id}`);
  };

  const deliveredTimestamps = reports.map((r) =>
    new Date(r.deliveredDate).getTime()
  );
  const minDeliveredValue = reports.length
    ? Math.min(...deliveredTimestamps)
    : 0;
  const maxDeliveredValue = reports.length
    ? Math.max(...deliveredTimestamps)
    : 0;
  const years = reports.map((r) => r.buildingYear);
  const minYearValue = reports.length ? Math.min(...years) : 0;
  const maxYearValue = reports.length ? Math.max(...years) : 0;
  const bras = reports.map((r) => r.bra);
  const minBraValue = reports.length ? Math.min(...bras) : 0;
  const maxBraValue = reports.length ? Math.max(...bras) : 0;

  return (
    <MainLayout
      sidebar={
        <ReportsSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={(e, newValue) =>
            setDateRange(newValue as number[])
          }
          buildingYearRange={buildingYearRange}
          onBuildingYearRangeChange={(e, newValue) =>
            setBuildingYearRange(newValue as number[])
          }
          applicationPurpose={applicationPurpose}
          onApplicationPurposeChange={setApplicationPurpose}
          clearFilters={() => {
            setSearchTerm("");
            if (reports.length > 0) {
              const deliveredTimestamps = reports.map((r) =>
                new Date(r.deliveredDate).getTime()
              );
              setDateRange([
                Math.min(...deliveredTimestamps),
                Math.max(...deliveredTimestamps),
              ]);
              const years = reports.map((r) => r.buildingYear);
              setBuildingYearRange([Math.min(...years), Math.max(...years)]);
              const bras = reports.map((r) => r.bra);
              setBraRange([Math.min(...bras), Math.max(...bras)]);
            }
            setApplicationPurpose("");
          }}
          minDelivered={minDeliveredValue}
          maxDelivered={maxDeliveredValue}
          minYear={minYearValue}
          maxYear={maxYearValue}
          minBra={minBraValue}
          maxBra={maxBraValue}
          purposeOptions={purposeOptions}
          braRange={braRange}
          onBraRangeChange={(e, newValue) => setBraRange(newValue as number[])}
        />
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Innsendte avfallsrapporter
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Godkjent" value="Godkjent" />
          <Tab label="Under behandling" value="Under behandling" />
          <Tab label="Avslått" value="Avslått" />
          <Tab label="Alle" value="Alle" />
        </Tabs>

        <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 2 }}>
          {reportsInTab.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {reportsInTab.map((report) => (
                <Box key={report.id} sx={{ flex: "1 1 300px" }}>
                  <ReportCard report={report} onViewReport={handleViewReport} />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Ingen søknader å vise
            </Typography>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ViewReports;
