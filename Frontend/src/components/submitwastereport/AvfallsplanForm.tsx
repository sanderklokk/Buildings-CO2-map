import { useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { WASTE_MATERIALS, WasteMaterial } from '../../assets/data';
import { AvfallsMaterialeRow } from './AvfallsMaterialeRow';
import { useBoundStore } from '../../store/Store';


export const AvfallsplanForm = () => {

    const { addAvfallRow, wasteReport } = useBoundStore().wasteReportForm;

    const [addWasteCategoryInputValue, setAddWasteCategoryInputValue] = useState<string>("");
    const [addWasteCategoryValue, setAddWasteCategoryValue] = useState<WasteMaterial | null>(null);
    const [showSubMaterials, setShowSubMaterials] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);


    const getSearchOptions = () => {
        // Show only toplevel categories if no input
        if (addWasteCategoryInputValue === "") return WASTE_MATERIALS.filter((wasteMaterial) => !wasteMaterial.parent && !wasteReport.avfall.farlig.concat(wasteReport.avfall.ordinert).map(x => x.id).includes(wasteMaterial.id));
        return WASTE_MATERIALS.filter((wasteMaterial) => !wasteReport.avfall.farlig.concat(wasteReport.avfall.ordinert).map(x => x.id).includes(wasteMaterial.id));
    }


    const getSubMaterials = (materialId: string) => {
        return WASTE_MATERIALS.filter((wasteMaterial) => wasteMaterial.parent === materialId);
    }

    const getSubMaterialsNotInUse = () => {
        return getSubMaterials(selected || "").filter((wasteMaterial) => !wasteReport.avfall.farlig.concat(wasteReport.avfall.ordinert).map(x => x.id).includes(wasteMaterial.id));
    }

    const handleAddWasteCategory = (value: WasteMaterial | null) => {
        if (value) {
            setSelected(value.id);
            if (getSubMaterials(value.id).length === 0) {
                setShowSubMaterials(false);
                addAvfallRow(value.id);
                setAddWasteCategoryValue(null);
                setAddWasteCategoryInputValue("");
            } else {
                setSelected(value.id);
                setShowSubMaterials(true);
            }
        }
    }

    return <> <Box>
        <Typography marginTop={2} fontSize={20} marginBottom={2}>Legg til type</Typography>
        <Box display={"flex"} justifyContent={"start"}>
            <Autocomplete
                options={getSearchOptions()}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                inputValue={addWasteCategoryInputValue}
                value={addWasteCategoryValue}
                onInputChange={(_, v) => setAddWasteCategoryInputValue(v)}
                onChange={(_, v) => { handleAddWasteCategory(v); }}
                renderInput={(params) => <TextField {...params} label="Materialtype" variant="outlined" />}
            />
        </Box>
        {showSubMaterials &&
            <Box>

                <Typography marginTop={2} fontSize={18} marginBottom={2}>Velg underkategori for {WASTE_MATERIALS.find(x => x.id == selected)?.name}</Typography>
                <Box>
                    {showSubMaterials && getSubMaterialsNotInUse().length === 0 && <Typography>Ingen gjenværende underkategorier </Typography>}
                    {showSubMaterials && getSubMaterialsNotInUse().map((material) => {
                        return <Button key={material.id} sx={{ margin: "3px" }} onClick={() => handleAddWasteCategory(material)} variant='outlined' >{material.name}</Button>

                    })}
                </Box>
            </Box>
        }

    </Box>
        <Box>
            <Typography className="text-lg mt-6" marginTop={2} fontSize={20} marginBottom={2}>Ordinært avfall</Typography>
            <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                <TableContainer className='max-w-[1200px]'>
                    <Table >
                        <TableHead className="bg-blue-100 border ">
                            <TableRow className="">
                                <TableCell><Typography className="font-bold">Ordinært avfall</Typography></TableCell>
                                <TableCell>Plan</TableCell>
                                <TableCell colSpan={5}>Sluttrapport</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography fontWeight={"bold"}>Type avfall</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Beregnet mengde (tonn)</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Faktisk mengde (tonn)</Typography></TableCell>
                                <TableCell ><Typography fontWeight={"bold"}>Avvik (tonn)</Typography></TableCell>
                                <TableCell colSpan={3} ><Typography fontWeight={"bold"}>Disponeringsmåte</Typography></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Avfallstyper som forventes å oppstå i tiltaket</TableCell>
                                <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                                <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                                <TableCell>Redegjør for vesentlige avvik på eget ark</TableCell>
                                <TableCell>Mengde levert til godkjent avfallsanlegg</TableCell>
                                <TableCell>Mengde til ombruk eller direkte gjenvinning</TableCell>
                                <TableCell>Leveringssted</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                wasteReport.avfall.ordinert.length > 0 ?
                                    wasteReport.avfall.ordinert.map((wasteCategory) => {
                                        return <AvfallsMaterialeRow key={wasteCategory.id} materialId={wasteCategory.id} />
                                    }) :
                                    <TableRow><TableCell colSpan={8}><Typography>Ingen ordinært avfall</Typography></TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Typography className="text-lg mt-6" marginTop={2} fontSize={20} marginBottom={2}>Farlig avfall</Typography>
            <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                <TableContainer className='max-w-[1200px]'>
                    <Table >
                        <TableHead className="bg-blue-100 border ">
                            <TableRow className="">
                                <TableCell><Typography className="font-bold">Farlig avfall</Typography></TableCell>
                                <TableCell>Plan</TableCell>
                                <TableCell colSpan={5}>Sluttrapport</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography fontWeight={"bold"}>Type avfall</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Beregnet mengde (tonn)</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Faktisk mengde (tonn)</Typography></TableCell>
                                <TableCell ><Typography fontWeight={"bold"}>Avvik (tonn)</Typography></TableCell>
                                <TableCell colSpan={3} ><Typography fontWeight={"bold"}>Disponeringsmåte</Typography></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Avfallstyper som forventes å oppstå i tiltaket</TableCell>
                                <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                                <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                                <TableCell>Redegjør for vesentlige avvik på eget ark</TableCell>
                                <TableCell>Mengde levert til godkjent avfallsanlegg</TableCell>
                                <TableCell>Mengde til ombruk eller direkte gjenvinning</TableCell>
                                <TableCell>Leveringssted</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                wasteReport.avfall.farlig.length > 0 ?
                                    wasteReport.avfall.farlig.map((wasteCategory) => {
                                        return <AvfallsMaterialeRow key={wasteCategory.id} materialId={wasteCategory.id} />
                                    }) :
                                    <TableRow><TableCell colSpan={8}><Typography>Ingen farlig avfall</Typography></TableCell></TableRow>

                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>

    </>
}
