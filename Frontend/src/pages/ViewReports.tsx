import React, { useState, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";
import ReportCard, { WasteReport } from "../components/viewReports/ReportCard";
import MainLayout from "../components/layout/MainLayout";

// Dummy-data for testing
const testReports: WasteReport[] = [
  {
    id: 1001,
    address: "Klæbuveien, Trondheim",
    sectionNumber: "A1",
    usageNumber: "101",
    totalWaste: 150,
    buildingYear: 1985,
    deliveredDate: "2023-11-01",
  },
  {
    id: 1002,
    address: "Prinsens gate, Trondheim",
    sectionNumber: "B2",
    usageNumber: "202",
    totalWaste: 200,
    buildingYear: 1995,
    deliveredDate: "2023-10-25",
  },
  {
    id: 1003,
    address: "kongens gate, Trondheim",
    sectionNumber: "C3",
    usageNumber: "303",
    totalWaste: 120,
    buildingYear: 1978,
    deliveredDate: "2023-10-30",
  },
];

interface ReportsSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ReportsSidebar = ({
  searchTerm,
  onSearchChange,
}: ReportsSidebarProps) => {
  return (
    <Box sx={{ p: 4 }}>
      <TextField
        label="Søk rapport"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 4 }}
      />
    </Box>
  );
};

const ViewReports = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Henter dummy-data for testing
    setReports(testReports);
  }, []);

  const filteredReports = reports.filter((report) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      report.address.toLowerCase().includes(lowerSearch) ||
      report.id.toString().includes(lowerSearch)
    );
  });

  const handleViewReport = (id: number) => {
    alert(`Viser rapport med ID: ${id}`);
  };

  return (
    <MainLayout
      sidebar={
        <ReportsSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      }
    >
      <Typography variant="h4" gutterBottom>
        Innsendte avfallsrapporter
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {filteredReports.map((report) => (
          <Box key={report.id} sx={{ flex: "1 1 300px" }}>
            <ReportCard report={report} onViewReport={handleViewReport} />
          </Box>
        ))}
      </Box>
    </MainLayout>
  );
};

export default ViewReports;
