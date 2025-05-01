import { useState, useEffect } from "react";
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
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SubMaterialChip from "./SubMaterialChip";
import { APIMaterialType } from "../../api/models";
import { useBoundStore } from "../../store/Store";
import { create_materialtype, delete_materialtype, update_materialtypes } from "../../api/materialtypeAPI";

interface FlattenedOption {
  id: number;
  label: string;
}

interface EditMaterialProps {
  material: APIMaterialType;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const EditMaterial = ({
  material,
  open,
  onClose,
  onSave,
}: EditMaterialProps) => {
  const { materials, setMaterials, replaceMaterials, removeMaterial } = useBoundStore().materialManagementSlice;

  const localsubcategories = (id: number | null) => {
    if (id == null) {
      return [];

    }
    return materials.filter((mat) => mat.forelder === id);
  }

  const globalsubcategories = (id: number | null): APIMaterialType[] => {
    if (id == null) {
      return [];
    }
    const subs = localsubcategories(id);
    const allsubs = new Set<APIMaterialType>();
    for (const sub of subs) {
      allsubs.add(sub);
      const s2 = globalsubcategories(sub.id);
      for (const s3 of s2) {
        {
          allsubs.add(s3);
        }
      }
    }
    return Array.from(allsubs);

  }
  const [localActive, setLocalActive] = useState(material.synlig);

  const [newSubName, setNewSubName] = useState("");
  const [newSubFarlig, setNewSubFarlig] = useState(false);

  const [selectedParent, setSelectedParent] = useState<number | "root">("root");
  const [showHideConfirmation, setShowHideConfirmation] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<APIMaterialType | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState<string>("");

  useEffect(() => {
    if (open) {
      setNewSubName("");
      setSelectedParent("root");
      setShowHideConfirmation(false);
    }
  }, [material, materials, open]);

  const handleToggleActive = () => {
    if (localActive) {
      setShowHideConfirmation(true);
    } else {
      activateMaterial();
      setLocalActive(true);
    }
  };

  const confirmHide = async () => {
    hideMaterial();

    setLocalActive(false);
    setShowHideConfirmation(false);
  };

  const hideMaterial = async () => {
    try {
      const materialsToUpdate = [...globalsubcategories(material.id), material].map((m) => ({
        ...m,
        synlig: false,
      }));
      const res = await update_materialtypes(materialsToUpdate);
      if (res.status === 200) {
        const updatedMaterials = res.data;
        replaceMaterials(updatedMaterials);
      } else {
        console.error("Failed to update material visibility");
      }
    } catch (error) {
      console.error("Error setting material active:", error);

    }
  }

  const activateMaterial = async () => {
    try {
      const materialsToUpdate = [...globalsubcategories(material.id), material].map((m) => ({
        ...m,
        synlig: true,
      }));
      const res = await update_materialtypes(materialsToUpdate);
      if (res.status === 200) {
        const updatedMaterials = res.data;
        replaceMaterials(updatedMaterials);
      } else {
        console.error("Failed to update material visibility");
      }
    } catch (error) {
      console.error("Error setting material active:", error);

    }
  }


  const cancelHide = () => {

    setShowHideConfirmation(false);
  };


  const getSubDepth = (material: APIMaterialType, depth = 0): number => {
    if (material.forelder === null) {
      return depth;
    }
    for (const m of materials) {
      if (material.forelder === m.id) {
        return getSubDepth(m, depth + 1);
      }
    }
    return depth;
  }

  const flattenSubcategories = (
    subs: APIMaterialType[],
  ): FlattenedOption[] => {
    const result: FlattenedOption[] = [];
    subs.forEach((sub) => {
      if (sub.id == null) {
        return;
      }
    
      const depth = getSubDepth(sub);
      result.push({
        id: sub.id,
        label: `${"—".repeat(depth)} ${sub.navn}`,
      });
    });
    return result;
  };

  const getMaterial = (id: number | string): APIMaterialType | null => {
    if (id === "root") {
      return material;
    }
    const m = materials.find((m) => m.id == id);
    return m ? m : null;
  };

  const handleAddSubcategory = async () => {
    if (newSubName.trim() !== "") {
      try {
        const parent = getMaterial(selectedParent)
        const res = await create_materialtype({
          id: null,
          navn: newSubName,
          forelder: selectedParent === "root" ? material.id : selectedParent,
          farlig: parent && parent.farlig ? true : newSubFarlig,
          synlig: parent ? parent.synlig : false,
        });

        if (res.status === 200) {
          const newSub = res.data;
          setMaterials([...materials, newSub]);

        }
      } catch (error) {
        console.error("Error creating subcategory:", error);
      }

      setNewSubName("");
      setSelectedParent("root");
    }
  };

  const removeSubById = async (id: number | null): Promise<APIMaterialType[]> => {
    if (id === null) {
      return [];
    }

    try {
      console.log("Deleting subcategory with id:", id);
      const res = await delete_materialtype(id);
      if (res.status === 200) {
        const affected_materials = res.data;
        console.log("affected_materials", affected_materials);
        return affected_materials;
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
    return []
  };

  const initiateDelete = (sub: APIMaterialType) => {
    setSubToDelete(sub);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (subToDelete) {
      const affected_materials = await removeSubById(subToDelete.id);
      if (subToDelete.id != null) {
        removeMaterial(subToDelete.id);
      }
      replaceMaterials(affected_materials);
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

  const GroupedSubcategories = ({ subs, level }: { subs: APIMaterialType[], level: number }) => {
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
              <SubMaterialChip label={<span>{sub.navn} {sub.farlig && <ReportProblemIcon color="warning" fontSize="inherit" />}</span> } />
              <IconButton
                data-testid={"delete-submaterial-button-"+sub.id}
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
            {localsubcategories(sub.id) && localsubcategories(sub.id).length > 0 && (
              <GroupedSubcategories
                subs={localsubcategories(sub.id)}
                level={level + 1}
              />
            )}
          </Box>
        ))}
      </>
    );
  };

  const handleClose = () => {
    onSave();
  };

  const flattenedOptions = flattenSubcategories(globalsubcategories(material.id));

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" data-testid="edit-material-popup">
        <DialogTitle>{material.navn}</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <FormControlLabel
              control={
                <Switch checked={localActive} data-testid={"hidden-switch"} onChange={handleToggleActive} />
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
                <Button variant="contained" data-testid="confirm-hidden" color="error" onClick={confirmHide}>
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
          <GroupedSubcategories subs={localsubcategories(material.id)} level={0} />
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="parent-select-label">
                Overordnet kategori
              </InputLabel>
              <Select 
                labelId="parent-select-label"
                data-testid="parent-select"
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
          <Box display={"flex"} gap={2} mt={2} alignItems={"center"}>
            <TextField
              label="Ny undermateriale"
              fullWidth
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
            />
               <FormControlLabel control={<Switch data-testid="create-sub-farlig-switch" value={newSubFarlig} checked={newSubFarlig || getMaterial(selectedParent)?.farlig} disabled={getMaterial(selectedParent)?.farlig}  onChange={(e) => setNewSubFarlig(e.target.checked)}/>} label="Farlig" />
                 
            <Button variant="contained" onClick={handleAddSubcategory}>
              Legg til
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>

          <Button onClick={handleClose} variant="contained">
            Lukk
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
        <DialogTitle>Bekreft sletting</DialogTitle>
        <DialogContent>
          <Typography>
            Er du sikker på at du vil slette undermateriale: {subToDelete?.navn}
            ? Denne handlingen kan ikke reverseres.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Skriv "bekreft" for å fortsette.
          </Typography>
          <TextField
            data-testid={"delete-confirm-input"}
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
            data-testid="confirm-delete-submatrial-button"
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
