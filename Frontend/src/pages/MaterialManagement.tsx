import { useEffect, useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MaterialCard from "../components/adminComponents/MaterialCard";
import AddMaterial from "../components/adminComponents/AddMaterial";
import MainLayout from "../components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { get_all_materialtypes, create_materialtype } from "../api/materialtypeAPI";
import { useBoundStore } from "../store/Store";

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
  const { data: materialsData, isLoading, isError } = useQuery(
    { queryKey: ["materials", true], queryFn: () => get_all_materialtypes(true) })

  

  const { materials, setMaterials } = useBoundStore().materialManagementSlice;

  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddNewMaterial = async (materialName: string, isFarlig: boolean) => {
    try {
      const res = await create_materialtype({
        id: null,
        navn: materialName,
        forelder: null,
        farlig: isFarlig,
        synlig: false,
      });

      if (res.status === 200) {
        const newmaterial = res.data;
        setMaterials([...materials, newmaterial]);
        console.log("Material created successfully:", newmaterial);
        console.log("Materials after creation:", materials);
        setOpenAddDialog(false);
      }
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };

  const subcategories = (id: number | null) => {
    if (id == null) {
      return [];
    } 
    return materials.filter((mat) => mat.forelder === id);
  }

  const filteredMaterials = materials?.filter((mat) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      mat.navn.toLowerCase().includes(lowerSearch) ||
      subcategories(mat.id).some((sub) => sub.navn.toLowerCase().includes(lowerSearch)
      )
    );
  }).filter(mat => mat.forelder == null);

  useEffect(() => {
    if (materialsData) {
      setMaterials(materialsData.data);
    }
  }, [materialsData, setMaterials]);

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
      { isLoading && <Typography>Loading...</Typography>}
      { isError && <Typography>Error loading materials</Typography>}
      { materials && (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      
        {filteredMaterials.map((mat) => (
          <MaterialCard
            key={mat.id}
            material={mat}
          />
        ))}
        {filteredMaterials.length === 0 && (
          <Typography marginLeft={2}>
            Ingen materialer funnet.
          </Typography>
        )}
        
      </Box>)}
     
      <AddMaterial
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={handleAddNewMaterial}
      />
    </MainLayout>
  );
};

export default MaterialManagement;
