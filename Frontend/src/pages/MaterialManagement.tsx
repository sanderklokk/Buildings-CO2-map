import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MaterialCard from "../components/adminComponents/MaterialCard";
import AddMaterial from "../components/adminComponents/AddMaterial";
import MainLayout from "../components/layout/MainLayout";
import demoData from "../../../Data/demomaterialer.json";
import { Material } from "../components/adminComponents/MaterialCardTypes";

interface MaterialSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenAddDialog: () => void;
}

const MaterialSidebar = ({
  searchTerm,
  onSearchChange,
  onOpenAddDialog,
}: MaterialSidebarProps) => {
  return (
    <Box sx={{ p: 4 }}>
      <TextField
        label="Søk materiale"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        onClick={onOpenAddDialog}
        sx={{ mt: 4 }}
      >
        Legg til nytt hovedmateriale
      </Button>
    </Box>
  );
};

const MaterialManagement = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    if (demoData && demoData.materials) {
      setMaterials(demoData.materials);
    }
  }, []);

  const handleUpdateMaterial = (updated: Material) => {
    setMaterials((prev) =>
      prev.map((mat) => (mat.id === updated.id ? updated : mat))
    );
  };

  const handleAddNewMaterial = (materialName: string) => {
    if (materialName.trim() !== "") {
      const newMaterial: Material = {
        id: Date.now(),
        name: materialName,
        active: true,
        subcategories: [],
      };
      setMaterials([...materials, newMaterial]);
      setOpenAddDialog(false);
    }
  };

  const filteredMaterials = materials.filter((mat) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      mat.name.toLowerCase().includes(lowerSearch) ||
      mat.subcategories.some((sub) =>
        sub.name.toLowerCase().includes(lowerSearch)
      )
    );
  });

  return (
    <MainLayout
      sidebar={
        <MaterialSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenAddDialog={() => setOpenAddDialog(true)}
        />
      }
    >
      <Typography variant="h4" gutterBottom>
        Rediger materialer
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {filteredMaterials.map((mat) => (
          <MaterialCard
            key={mat.id}
            material={mat}
            onUpdateMaterial={handleUpdateMaterial}
          />
        ))}
      </Box>
      <AddMaterial
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={handleAddNewMaterial}
      />
    </MainLayout>
  );
};

export default MaterialManagement;
