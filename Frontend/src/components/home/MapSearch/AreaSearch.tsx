import {
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AREAS, BUILDING_TYPES } from "../../../assets/data";

export const AreaSearch = () => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const handleChangeArea = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedAreas(typeof value === "string" ? value.split(",") : value);
  };

  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState<string[]>(
    [],
  );

  const handleChangeBuildingTypes = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedBuildingTypes(
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const handleAreaSearch = () => {};

  return (
    <div className="w-3/5 mx-auto pt-20 flex flex-col text-left">
      <h2 className="font-semibold text-lg">Områdesøk</h2>

      <div className="mt-4 flex flex-col">
        <label>Legg til filter</label>
        <FormControl sx={{ height: "40px" }}>
          <Select
            size="small"
            multiple
            value={selectedAreas}
            displayEmpty
            onChange={handleChangeArea}
            renderValue={(selected) => {
              return (
                <div
                  className=" text-trk-white text-sm flex items-center justify-items-start"
                  style={{ borderRadius: "0px" }}
                >
                  <AddIcon />
                  <span className="">
                    {selected.length == 0
                      ? "Velg område"
                      : AREAS.filter((area) => selectedAreas.includes(area.id))
                          .map((area) => area.name)
                          .join(", ")}
                  </span>
                </div>
              );
            }}
            className="w-full bg-trk-deep-blue text-trk-white h-8 flex"
            sx={{
              borderRadius: "0px",
              boxSizing: "border-box",
              border: "0px",
              ".MuiSelect-select": {
                paddingLeft: "3px",
              },
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  style: {
                    borderRadius: "0px",
                    border: "2px solid var(--color-trk-deep-blue)",
                    boxSizing: "border-box",
                  },
                },
              },
            }}
          >
            {AREAS.map((area) => (
              <MenuItem
                key={area.id}
                value={area.id}
                className="rounded-none h-6 flex text-left p-0 m-0 text-sm"
              >
                <Checkbox
                  checked={selectedAreas.includes(area.id)}
                  value={area.id}
                  size="small"
                />
                <p className="text-sm">{area.name}</p>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ height: "40px" }}>
          <Select
            size="small"
            multiple
            value={selectedBuildingTypes}
            displayEmpty
            onChange={handleChangeBuildingTypes}
            renderValue={(selected) => {
              return (
                <div
                  className=" text-trk-white text-sm flex items-center justify-items-start"
                  style={{ borderRadius: "0px" }}
                >
                  <AddIcon />
                  <span className="">
                    {selected.length == 0
                      ? "Velg byggtype"
                      : BUILDING_TYPES.filter((building) =>
                          selectedBuildingTypes.includes(building.id),
                        )
                          .map((building) => building.name)
                          .join(", ")}
                  </span>
                </div>
              );
            }}
            className="w-full bg-trk-deep-blue text-trk-white h-8 flex"
            sx={{
              borderRadius: "0px",
              boxSizing: "border-box",
              border: "0px",
              ".MuiSelect-select": {
                paddingLeft: "3px",
              },
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  style: {
                    borderRadius: "0px",
                    border: "2px solid var(--color-trk-deep-blue)",
                    boxSizing: "border-box",
                  },
                },
                root: {
                  style: {
                    padding: "0px",
                  },
                },
              },
            }}
          >
            {BUILDING_TYPES.map((building) => (
              <MenuItem
                key={building.id}
                value={building.id}
                className="rounded-none h-6 flex text-left p-0 m-0 text-sm"
              >
                <Checkbox
                  checked={selectedBuildingTypes.includes(building.id)}
                  value={building.id}
                  size="small"
                />
                <p className="text-sm">{building.name}</p>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <button
        className={`text-trk-white bg-trk-deep-blue border-2 w-fit text-sm px-12 py-2 cursor-pointer active:bg-trk-light-blue mt-4`}
        onClick={() => handleAreaSearch()}
      >
        Søk
      </button>
    </div>
  );
};
