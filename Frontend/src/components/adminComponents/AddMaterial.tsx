import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface AddMaterialProps {
  open: boolean;
  onClose: () => void;
  onAdd: (materialName: string) => void;
}

const AddMaterial: React.FC<AddMaterialProps> = ({ open, onClose, onAdd }) => {
  const [materialName, setMaterialName] = useState("");

  const handleAdd = () => {
    if (materialName.trim() !== "") {
      onAdd(materialName);
      setMaterialName("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Legg til nytt hovedmateriale</DialogTitle>
      <DialogContent>
        <TextField
          label="Materialnavn"
          fullWidth
          value={materialName}
          onChange={(e) => setMaterialName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Avbryt</Button>
        <Button onClick={handleAdd} variant="contained">
          Legg til
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMaterial;
