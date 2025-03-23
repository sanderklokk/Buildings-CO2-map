import React from "react";
import { Chip } from "@mui/material";

interface SubMaterialChipProps {
  label: string;
}

export const SubMaterialChip: React.FC<SubMaterialChipProps> = ({ label }) => {
  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: "var(--color-trk-deep-blue)",
        color: "var(--color-trk-white)",
      }}
    />
  );
};

export default SubMaterialChip;
