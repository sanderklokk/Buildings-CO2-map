import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SubMaterialChip from "./SubMaterialChip";
import { Material, SubMaterial } from "./MaterialCardTypes";

interface FlattenedOption {
  id: number;
  label: string;
}

interface EditMaterialProps {
  material: Material;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Material) => void;
}

const EditMaterial: React.FC<EditMaterialProps> = ({
  material,
  open,
  onClose,
  onSave,
}) => {
  const [localActive, setLocalActive] = useState(material.active);
  const [localSubcategories, setLocalSubcategories] = useState<SubMaterial[]>(
    material.subcategories ?? []
  );
  const [newSubName, setNewSubName] = useState("");

  const [selectedParent, setSelectedParent] = useState<number | "root">("root");
  const [showHideConfirmation, setShowHideConfirmation] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<SubMaterial | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  useEffect(() => {
    if (open) {
      setLocalActive(material.active);
      setLocalSubcategories(material.subcategories ?? []);
      setNewSubName("");
      setSelectedParent("root");
      setShowHideConfirmation(false);
    }
  }, [material, open]);

  const handleToggleActive = () => {
    if (localActive) {
      setShowHideConfirmation(true);
    } else {
      setLocalActive(true);
    }
  };

  const confirmHide = () => {
    setLocalActive(false);
    setShowHideConfirmation(false);
  };

  const cancelHide = () => {
    setShowHideConfirmation(false);
  };

  const flattenSubcategories = (
    subs: SubMaterial[],
    level: number = 0
  ): FlattenedOption[] => {
    let result: FlattenedOption[] = [];
    subs.forEach((sub) => {
      result.push({ id: sub.id, label: `${"—".repeat(level)} ${sub.name}` });
      if (sub.subcategories && sub.subcategories.length > 0) {
        result = result.concat(
          flattenSubcategories(sub.subcategories, level + 1)
        );
      }
    });
    return result;
  };

  const addSubToParent = (
    subs: SubMaterial[],
    parentId: number,
    newSub: SubMaterial
  ): SubMaterial[] => {
    return subs.map((sub) => {
      if (sub.id === parentId) {
        return {
          ...sub,
          subcategories: sub.subcategories
            ? [...sub.subcategories, newSub]
            : [newSub],
        };
      } else if (sub.subcategories && sub.subcategories.length > 0) {
        return {
          ...sub,
          subcategories: addSubToParent(sub.subcategories, parentId, newSub),
        };
      }
      return sub;
    });
  };

  const handleAddSubcategory = () => {
    if (newSubName.trim() !== "") {
      const newSub: SubMaterial = {
        id: Date.now(),
        name: newSubName,
        subcategories: [],
      };
      if (selectedParent === "root") {
        setLocalSubcategories([...localSubcategories, newSub]);
      } else {
        setLocalSubcategories((prev) =>
          addSubToParent(prev, selectedParent as number, newSub)
        );
      }
      setNewSubName("");
      setSelectedParent("root");
    }
  };

  const removeSubById = (subs: SubMaterial[], id: number): SubMaterial[] => {
    return subs
      .filter((sub) => sub.id !== id)
      .map((sub) => ({
        ...sub,
        subcategories: sub.subcategories
          ? removeSubById(sub.subcategories, id)
          : [],
      }));
  };

  const initiateDelete = (sub: SubMaterial) => {
    setSubToDelete(sub);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (subToDelete) {
      setLocalSubcategories(removeSubById(localSubcategories, subToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setSubToDelete(null);
    setDeleteConfirmInput("");
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setSubToDelete(null);
    setDeleteConfirmInput("");
  };

  const GroupedSubcategories: React.FC<{
    subs: SubMaterial[];
    level: number;
  }> = ({ subs, level }) => {
    return (
      <>
        {subs.map((sub) => (
          <Box
            key={sub.id}
            sx={{
              ml: level * 2,
              mt: 1,
              borderLeft: "2px solid #ccc",
              pl: 1,
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <SubMaterialChip label={sub.name} />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  initiateDelete(sub);
                }}
                sx={{ ml: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            {sub.subcategories && sub.subcategories.length > 0 && (
              <GroupedSubcategories
                subs={sub.subcategories}
                level={level + 1}
              />
            )}
          </Box>
        ))}
      </>
    );
  };

  const handleSave = () => {
    onSave({
      ...material,
      active: localActive,
      subcategories: localSubcategories,
    });
  };

  const flattenedOptions = flattenSubcategories(localSubcategories);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{material.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <FormControlLabel
              control={
                <Switch checked={localActive} onChange={handleToggleActive} />
              }
              label="Material synlig"
            />
          </Box>
          {showHideConfirmation && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid red",
                borderRadius: 1,
              }}
            >
              <Typography color="error" variant="body1">
                Ved å skjule materialet vil ikke hovedmaterialet eller
                tilhørende undermaterialer lenger være synlig for de som sender
                inn avfallsrapporter. Ønsker du fortsatt å skjule dette
                materialet?
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                <Button variant="contained" color="error" onClick={confirmHide}>
                  Bekreft
                </Button>
                <Button variant="outlined" onClick={cancelHide}>
                  Avbryt
                </Button>
              </Box>
            </Box>
          )}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Undermaterialer
          </Typography>
          <GroupedSubcategories subs={localSubcategories} level={0} />
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="parent-select-label">
                Overordnet kategori
              </InputLabel>
              <Select
                labelId="parent-select-label"
                value={selectedParent}
                label="Overordnet kategori"
                onChange={(e) =>
                  setSelectedParent(e.target.value as number | "root")
                }
              >
                <MenuItem value="root">Nytt undermateriale</MenuItem>
                {flattenedOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Ny undermateriale"
              fullWidth
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddSubcategory}>
              Legg til
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Avbryt</Button>
          <Button onClick={handleSave} variant="contained">
            Lagre
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
        <DialogTitle>Bekreft sletting</DialogTitle>
        <DialogContent>
          <Typography>
            Er du sikker på at du vil slette undermateriale: {subToDelete?.name}
            ? Denne handlingen kan ikke reverseres.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Skriv "bekreft" for å fortsette.
          </Typography>
          <TextField
            label='Skriv "bekreft"'
            fullWidth
            value={deleteConfirmInput}
            onChange={(e) => setDeleteConfirmInput(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Avbryt</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={deleteConfirmInput.toLowerCase() !== "bekreft"}
          >
            Slett
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditMaterial;
