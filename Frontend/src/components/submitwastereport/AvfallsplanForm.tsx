import { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { WASTE_MATERIALS, WasteMaterial } from '../../assets/data';
import { AvfallsMaterialeRow } from './AvfallsMaterialeRow';


export const AvfallsplanForm = () => {



    const [addWasteCategoryInputValue, setAddWasteCategoryInputValue] = useState<string>("");
    const [addWasteCategoryValue, setAddWasteCategoryValue] = useState<WasteMaterial | null>(null);
    const [wasteCategories, setWasteCategories] = useState<WasteMaterial[]>([]);
    const handleAddWasteCategory = (value: WasteMaterial | null) => {
        if (value) {
            setWasteCategories([...wasteCategories, value]);
            setAddWasteCategoryValue(null);
            setAddWasteCategoryInputValue("");
        }
    }

    return <> <Box>
        <Typography className="text-lg mt-6" marginTop={2} fontSize={20} marginBottom={2}>Legg til type</Typography>
        <Box display={"flex"} justifyContent={"start"}>
            <Autocomplete
                options={WASTE_MATERIALS.filter((wasteMaterial) => !wasteCategories.includes(wasteMaterial))}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                inputValue={addWasteCategoryInputValue}
                value={addWasteCategoryValue}
                onInputChange={(_, v) => setAddWasteCategoryInputValue(v)}
                onChange={(_, v) => { handleAddWasteCategory(v); }}
                renderInput={(params) => <TextField {...params} label="Materialtype" variant="outlined" />}

            />
        </Box>
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
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography fontWeight={"bold"}>Type avfall</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Beregnet mengde (tonn)</Typography></TableCell>
                                <TableCell><Typography fontWeight={"bold"}>Faktisk mengde (tonn)</Typography></TableCell>
                                <TableCell ><Typography fontWeight={"bold"}>Avvik (tonn)</Typography></TableCell>
                                <TableCell colSpan={3} ><Typography fontWeight={"bold"}>Disponeringsmåte</Typography></TableCell>
                        
                            </TableRow>
                            <TableRow>
                                <TableCell>Avfallstyper som forventes å oppstå i tiltaket</TableCell>
                                <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                                <TableCell>Fraksjoner som skal kildesorteres</TableCell>
                                <TableCell>Redegjør for vesentlige avvik på eget ark</TableCell>
                                <TableCell>Mengde levert til godkjent avfallsanlegg</TableCell>
                                <TableCell>Mengde til ombruk eller direkte gjenvinning</TableCell>
                                <TableCell>Leveringssted</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                wasteCategories.map((wasteCategory) => {
                                    return <AvfallsMaterialeRow key={wasteCategory.id} wasteMaterial={wasteCategory} />
                                })

                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </Box></>
}
