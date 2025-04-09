import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import { WasteReport } from "../../types/ReportTypes";

interface ReportCardProps {
  report: WasteReport;
  onViewReport: (id: number) => void;
}

const getStatusIcon = (status: WasteReport["status"]) => {
  switch (status) {
    case "Godkjent":
      return <CheckCircleIcon color="success" />;
    case "Under behandling":
      return <HourglassEmptyIcon color="warning" />;
    case "Avslått":
      return <CancelIcon color="error" />;
    default:
      return null;
  }
};

const ReportCard = ({ report, onViewReport }: ReportCardProps) => {
  return (
    <Card sx={{ minHeight: 250, maxWidth: 300, position: "relative" }}>
      <CardContent sx={{ position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          {getStatusIcon(report.status)}
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Rapport-ID:</strong> {report.id}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <HomeIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{report.address}</Typography>
        </Box>
        <Typography variant="body2">
          <strong>Bruksnr.:</strong> {report.usageNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Seksjonsnr.:</strong> {report.sectionNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Ansvarlig:</strong> {report.responsible}
        </Typography>
        <Typography variant="body2">
          <strong>Saksbehandler:</strong> {report.caseHandler}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Søknadsformål:</strong> {report.applicationPurpose}
        </Typography>
        <Typography variant="body2">
          <strong>Total avfall:</strong> {report.totalWaste} kg
        </Typography>
        <Typography variant="body2">
          <strong>Byggår:</strong> {report.buildingYear}
        </Typography>
        <Typography variant="body2">
          <strong>Dato levert:</strong> {report.deliveredDate}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>BRA (m²):</strong> {report.bra}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          onClick={() => onViewReport(report.id)}
        >
          Se rapport
        </Button>
      </CardActions>
    </Card>
  );
};

export default ReportCard;
