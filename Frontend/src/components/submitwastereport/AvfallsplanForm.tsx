import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { AvfallsMaterialeRow } from "./AvfallsMaterialeRow";
import { useBoundStore } from "../../store/Store";
import { useQuery } from "@tanstack/react-query";
import { get_all_materialtypes } from "../../api/materialtypeAPI";
import { APIMaterialType } from "../../api/models";

export const AvfallsplanForm = () => {
  const {
    data: materialtypes,
    isLoading: isMaterialsLoading,
    isError: isMaterialsError,
  } = useQuery({
    queryKey: ["materialtypes", false],
    queryFn: () => get_all_materialtypes(false),
  });

  const { addAvfallRow, wasteReport } = useBoundStore().wasteReportForm;

  const [addWasteCategoryInputValue, setAddWasteCategoryInputValue] =
    useState<string>("");
  const [addWasteCategoryValue, setAddWasteCategoryValue] =
    useState<APIMaterialType | null>(null);
  const [showSubMaterials, setShowSubMaterials] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);

  const getSearchOptions = () => {
    // Show only toplevel categories if no input

    if (!materialtypes?.data) return [];

    if (addWasteCategoryInputValue === "")
      return materialtypes.data.filter(
        (wasteMaterial) => !wasteMaterial.forelder,
      );
    return materialtypes.data.filter(
      (wasteMaterial) =>
        !wasteReport.avfall.farlig
          .concat(wasteReport.avfall.ordinert)
          .map((x) => x.id)
          .includes(wasteMaterial.id == null ? -1 : wasteMaterial.id) ||
        getSubMaterials(wasteMaterial.id).length > 0,
    );
  };

  const getMaterialById = (id: number) => {
    return materialtypes?.data.find((x) => x.id === id);
  };

  const getSubMaterials = (materialId: number | null) => {
    if (!materialtypes) return [];

    return materialtypes.data.filter(
      (wasteMaterial) => wasteMaterial.forelder === materialId,
    );
  };

  const getSubMaterialsNotInUse = () => {
    if (!selected) return [];

    return getSubMaterials(selected).filter(
      (wasteMaterial) =>
        !wasteReport.avfall.farlig
          .concat(wasteReport.avfall.ordinert)
          .map((x) => x.id)
          .includes(wasteMaterial.id == null ? -1 : wasteMaterial.id),
    );
  };

  const handleAddWasteCategory = (
    value: APIMaterialType | null,
    force = false,
  ) => {
    if (value) {
      if (value.id == null) return;

      setSelected(value.id);
      if (getSubMaterials(value.id).length === 0 || force) {
        if (
          wasteReport.avfall.farlig
            .concat(wasteReport.avfall.ordinert)
            .map((x) => x.id)
            .includes(value.id)
        ) {
          setAddWasteCategoryValue(null);
          setAddWasteCategoryInputValue("");
          return;
        }

        setShowSubMaterials(false);
        addAvfallRow(value.id, value.farlig);
        setAddWasteCategoryValue(null);
        setAddWasteCategoryInputValue("");
      } else {
        setSelected(value.id);
        setShowSubMaterials(true);
      }
    }
  };

  return (
    <>
      <Box>
        <Typography marginTop={2} fontSize={20} marginBottom={2}>
          Legg til type
        </Typography>
        {materialtypes && (
          <>
            <Box display={"flex"} justifyContent={"start"}>
              <Autocomplete
                data-testid="reportform-material-autocomplete"
                options={getSearchOptions()}
                getOptionLabel={(option) => option.navn}
                style={{ width: 300 }}
                inputValue={addWasteCategoryInputValue}
                value={addWasteCategoryValue}
                onInputChange={(_, v) => setAddWasteCategoryInputValue(v)}
                onChange={(_, v) => {
                  handleAddWasteCategory(v);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Materialtype"
                    data-testid="reportform-material-input"
                    variant="outlined"
                  />
                )}
              />
            </Box>
            {showSubMaterials && (
              <Box>
                <Typography marginTop={2} fontSize={18} marginBottom={2}>
                  Velg underkategori for{" "}
                  {materialtypes.data.find((x) => x.id == selected)?.navn}
                </Typography>
                <Box>
                  {(() => {
                    if (!selected) return;
                    const mat = getMaterialById(selected);
                    if (!mat) return;

                    return (
                      <Button
                        key={mat.id}
                        sx={{ margin: "3px" }}
                        onClick={() => handleAddWasteCategory(mat, true)}
                        variant="outlined"
                        data-testid="reportform-add-parent-material"
                      >
                        {mat.navn}
                      </Button>
                    );
                  })()}
                  <Divider orientation="vertical" className="inline" />
                  {showSubMaterials &&
                    getSubMaterialsNotInUse().length === 0 && (
                      <Typography>
                        Ingen gjenværende underkategorier{" "}
                      </Typography>
                    )}
                  {showSubMaterials &&
                    getSubMaterialsNotInUse().map((material) => {
                      return (
                        <Button
                          key={material.id}
                          sx={{ margin: "3px" }}
                          onClick={() => handleAddWasteCategory(material)}
                          variant="outlined"
                          data-testid={
                            "reportform-add-sub-material-" + material.id
                          }
                        >
                          {material.navn}
                        </Button>
                      );
                    })}
                </Box>
              </Box>
            )}
          </>
        )}
        {isMaterialsLoading && <Typography>Loading...</Typography>}
        {isMaterialsError && <Typography>Error loading materials</Typography>}
      </Box>
      <Box>
        <Typography
          className="text-lg mt-6"
          marginTop={2}
          fontSize={20}
          marginBottom={2}
        >
          Ordinært avfall
        </Typography>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          gap={3}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <TableContainer className="max-w-[1200px]">
            <Table>
              <TableHead
                className="bg-blue-100 border "
                data-testid="reportform-ordinert-head"
              >
                <TableRow className="">
                  <TableCell>
                    <Typography className="font-bold">
                      Ordinært avfall
                    </Typography>
                  </TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell colSpan={5}>Sluttrapport</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={"bold"}>Type avfall</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"}>
                      Beregnet mengde (tonn)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"}>
                      Faktisk mengde (tonn)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"}>Avvik (tonn)</Typography>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <Typography fontWeight={"bold"}>
                      Disponeringsmåte
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Avfallstyper som forventes å oppstå i tiltaket
                  </TableCell>
                  <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                  <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                  <TableCell>
                    Redegjør for vesentlige avvik på eget ark
                  </TableCell>
                  <TableCell>
                    Mengde levert til godkjent avfallsanlegg
                  </TableCell>
                  <TableCell>
                    Mengde til ombruk eller direkte gjenvinning
                  </TableCell>
                  <TableCell>Leveringssted</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wasteReport.avfall.ordinert.length > 0 ? (
                  wasteReport.avfall.ordinert.map((wasteCategory) => {
                    return (
                      <AvfallsMaterialeRow
                        key={wasteCategory.id}
                        material={materialtypes?.data.find(
                          (x) => x.id == wasteCategory.id,
                        )}
                      />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography>Ingen ordinært avfall</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Typography
          className="text-lg mt-6"
          marginTop={2}
          fontSize={20}
          marginBottom={2}
        >
          Farlig avfall
        </Typography>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          gap={3}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <TableContainer className="max-w-[1200px]">
            <Table>
              <TableHead
                className="bg-blue-100 border "
                data-testid="reportform-farlig-head"
              >
                <TableRow className="">
                  <TableCell>
                    <Typography className="font-bold">Farlig avfall</Typography>
                  </TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell colSpan={5}>Sluttrapport</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={"bold"}>Type avfall</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"}>
                      Beregnet mengde (tonn)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"}>
                      Faktisk mengde (tonn)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={"bold"}>Avvik (tonn)</Typography>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <Typography fontWeight={"bold"}>
                      Disponeringsmåte
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Avfallstyper som forventes å oppstå i tiltaket
                  </TableCell>
                  <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                  <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                  <TableCell>
                    Redegjør for vesentlige avvik på eget ark
                  </TableCell>
                  <TableCell>
                    Mengde levert til godkjent avfallsanlegg
                  </TableCell>
                  <TableCell>
                    Mengde til ombruk eller direkte gjenvinning
                  </TableCell>
                  <TableCell>Leveringssted</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wasteReport.avfall.farlig.length > 0 ? (
                  wasteReport.avfall.farlig.map((wasteCategory) => {
                    return (
                      <AvfallsMaterialeRow
                        key={wasteCategory.id}
                        material={materialtypes?.data.find(
                          (x) => x.id == wasteCategory.id,
                        )}
                      />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography>Ingen farlig avfall</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};
