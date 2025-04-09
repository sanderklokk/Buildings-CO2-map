import React, { useState } from "react";
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
import EditMaterial from "./EditMaterial";
import { Material } from "./MaterialCardTypes";

interface MaterialCardProps {
  material: Material;
  onUpdateMaterial: (updated: Material) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onUpdateMaterial,
}) => {
  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleSaveEdit = (updatedMaterial: Material) => {
    onUpdateMaterial(updatedMaterial);
    setOpenEdit(false);
  };

  const renderSubcategories = (subs: Material["subcategories"], level = 0) => {
    return subs.map((sub) => (
      <Box key={sub.id} sx={{ ml: level * 2, mt: 1 }}>
        <SubMaterialChip label={sub.name} />
        {sub.subcategories &&
          sub.subcategories.length > 0 &&
          renderSubcategories(sub.subcategories, level + 1)}
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
            label={material.active ? "Synlig" : "Skjult"}
            color={material.active ? "success" : "default"}
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
            {material.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Undermaterialer
          </Typography>
          <Box>{renderSubcategories(material.subcategories)}</Box>
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
