import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { APIWasteReportOverview } from "../../api/models";

export interface WasteReport {
  id: number;
  address: string;
  sectionNumber: string;
  usageNumber: string;
  totalWaste: number;
  buildingYear: number;
  deliveredDate: string;
}

interface ReportCardProps {
  report: APIWasteReportOverview;
  onViewReport: (id: string) => void;
}

const ReportCard = ({ report, onViewReport }: ReportCardProps) => {
  return (
    <Card sx={{ minHeight: 250 }} data-testid={"report-card-"+report.id}>
      <CardContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Rapport-ID:</strong> {report.id}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <HomeIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">{report.address}</Typography>
        </Box>
        <Typography variant="body2">
          <strong>Bruksnr.:</strong> {/*report.usageNumber*/}
        </Typography>
        <Typography variant="body2">
          <strong>Seksjonsnr.:</strong> {/*report.sectionNumber*/}
        </Typography>
        <Typography variant="body2">
          <strong>Total mengde avfall:</strong> {report.totalmaterials} tonn
        </Typography>
        <Typography variant="body2">
          <strong>Byggeår: </strong> {report.buildingmadedate.split("-")[0]}
        </Typography>
        <Typography variant="body2">
          <strong>Dato levert:</strong> {report.dato}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          size="small"
          variant="contained"
          data-testid="show-report-btn"
          onClick={() => onViewReport(report.id.toString())}
        >
          Se detaljert rapport
        </Button>
      </CardActions>
    </Card>
  );
};

export default ReportCard;
