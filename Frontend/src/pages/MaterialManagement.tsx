import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MaterialCard from "../components/adminComponents/MaterialCard";
import AddMaterial from "../components/adminComponents/AddMaterial";

// For testing med demodata
import demoData from "../../../Data/demomaterialer.json";
import { Material } from "../components/adminComponents/MaterialCardTypes";

const MaterialManagement: React.FC = () => {
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
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rediger materialer
      </Typography>

      {/* Søkefelt */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Søk etter materiale eller undermateriale"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Knapp for å legge til nytt materiale */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Legg til nytt materiale hovedmateriale
        </Button>
      </Box>

      {/* Kortvisning av materialene */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {filteredMaterials.map((mat) => (
          <MaterialCard
            key={mat.id}
            material={mat}
            onUpdateMaterial={handleUpdateMaterial}
          />
        ))}
      </Box>

      {/* Legge til nytt materiale */}
      <AddMaterial
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={handleAddNewMaterial}
      />
    </Container>
  );
};

export default MaterialManagement;
