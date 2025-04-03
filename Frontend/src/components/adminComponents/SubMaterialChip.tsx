import React from "react";
import { Chip } from "@mui/material";

interface SubMaterialChipProps {
  label: string;
}

export const SubMaterialChip: React.FC<SubMaterialChipProps> = ({ label }) => {
  return <Chip color="secondary" label={label} />;
};

export default SubMaterialChip;
