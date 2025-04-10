import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SubMaterialChip from "./SubMaterialChip";
import { APIMaterialType } from "../../api/models";
import EditMaterial from "./EditMaterial";
import { useBoundStore } from "../../store/Store";

interface MaterialCardProps {
  material: APIMaterialType;
}

const MaterialCard = ({
  material,
}: MaterialCardProps) => {

  const { materials } = useBoundStore().materialManagementSlice;
  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleSaveEdit = () => {
    setOpenEdit(false);
  };

  const subcategories = (id: number | null) => {
    if (id == null) {
      return [];
    }
    return materials.filter((mat) => mat.forelder === id);
  }


  const renderSubcategories = (subs: APIMaterialType[], level=0) => {
    return subs.map((sub) => (
      <Box key={sub.id} sx={{ ml: level * 2, mt: 1 }}>
        <SubMaterialChip label={sub.navn} />
        {subcategories(sub.id) &&
          subcategories(sub.id).length > 0 &&
          renderSubcategories(subcategories(sub.id), level + 1)}
      </Box>
    ));

  };

  return (
    <>
      <Card sx={{ width: 300 }}>
        <Box
          sx={{
            backgroundColor: "var(--color-trk-light-blue)",
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={material.synlig ? "Synlig" : "Skjult"}
            color={material.synlig ? "success" : "default"}
          />
          <Button
            variant="text"
            size="small"
            startIcon={<EditIcon />}
            onClick={handleOpenEdit}
          >
            Rediger materiale
          </Button>
        </Box>

        <CardContent>
          <Typography variant="h6" gutterBottom>
            {material.navn}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Undermaterialer
          </Typography>
          <Box>{renderSubcategories(subcategories(material.id))}</Box>
        </CardContent>
      </Card>

      <EditMaterial
        material={material}
        open={openEdit}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default MaterialCard;
