import { useState } from "react";
import { Container, Typography, TextField, Box, Pagination } from "@mui/material";
import ReportCard from "../components/viewReports/ReportCard";
import { get_wastereports } from "../api/wastereportAPI";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from 'use-debounce';

// Data for testing
/*
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
];*/

const ViewReports = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const count = 9;
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const { data: reports, isLoading, isError } = useQuery({ queryKey: ["wastereports", page, count, debouncedSearch], queryFn: () => get_wastereports(page, count, debouncedSearch) });

  const navigate = useNavigate();

  const handleViewReport = (id: number) => {
    navigate(`/report/view/${id}`);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Innsendte avfallsrapporter
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Søk i avfallsrapporter"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {isLoading && <Typography>Henter rapporter...</Typography>}
      {isError && <Typography>Feil oppstod under henting av rapporter</Typography>}
      {reports?.data.results &&
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {reports.data.results.length === 0 && <Typography>Ingen rapporter med valgt søk</Typography>}
            {
              reports.data.results.map((report) => (

                <Box key={report.id} sx={{ flex: "1 1 300px" }}>
                  <ReportCard report={report} onViewReport={handleViewReport} />
                </Box>
              ))
            }

          </Box>
          <Box flex={1} display="flex" justifyContent="center" marginTop={3}>
            <Pagination page={page} count={Math.ceil((reports.data.total / count) + 0.1)} onChange={(_, value) => setPage(value)} />
          </Box>
        </Box>
      }
    </Container>
  );
};

export default ViewReports;
