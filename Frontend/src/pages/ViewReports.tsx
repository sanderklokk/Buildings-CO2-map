import { useState } from "react";
import { Typography, Box, TextField, Pagination } from "@mui/material";
import ReportCard from "../components/viewReports/ReportCard";
import { get_wastereports } from "../api/wastereportAPI";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import MainLayout from "../components/layout/MainLayout";

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

export const ViewReports = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const count = 9;
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const {
    data: reports,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wastereports", page, count, debouncedSearch],
    queryFn: () => get_wastereports(page, count, debouncedSearch),
  });

  const navigate = useNavigate();

  const handleViewReport = (id: string) => {
    navigate(`/report/view/${id}`);
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
      {isError && (
        <Typography data-testid={"reports-error-msg"}>
          Feil oppstod under henting av rapporter
        </Typography>
      )}
      {reports && reports.data.results && (
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {reports.data.results.length === 0 && (
              <Typography>Ingen rapporter med valgt søk</Typography>
            )}
            {reports.data.results.map((report) => (
              <Box key={report.id} sx={{ flex: "1 1 300px" }}>
                <ReportCard report={report} onViewReport={handleViewReport} />
              </Box>
            ))}
          </Box>
          <Box flex={1} display="flex" justifyContent="center" marginTop={3}>
            <Pagination
              data-testid={"viewreports-pagination"}
              page={page}
              count={Math.ceil(reports.data.total / count + 0.1)}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        </Box>
      )}
    </MainLayout>
  );
};
