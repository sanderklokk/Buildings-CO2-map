import { Box, FormControl, Link, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { get_wastereport } from "../api/wastereportAPI";
import { TextField, RadioGroup, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";




export const DetailedReport = () => {

    const id = useParams().id;

    const { data: report, isLoading, isError } = useQuery({ queryKey: ["wastereport", id], queryFn: () => get_wastereport(id || "") });


    return <Box width={"100%"} flexGrow={1} maxWidth={"1200px"} mx={"auto"} display={"flex"} flexDirection={"column"} alignContent={"start"} marginBottom={10} padding={2}>
        <Box>
            <Link href={"/report/all"} className="text-blue-500 hover:text-blue-700">
                Tilbake
            </Link>
        <Typography variant="h4" marginTop={2} >
           Avfallsrapport
        </Typography>
        <Typography marginBottom={2} >
            Ref: {id}
        </Typography>
        </Box>
        {isLoading && <Typography variant="h5">Laster...</Typography>}
        {isError && <Typography variant="h5">Feil oppstod under henting av rapport.</Typography>}
        {report?.data &&
            <FormControl>
                <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
                    <h1 className="text-xl text-center mt-6">Eiendom/Byggested</h1>
                    <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                        <TextField slotProps={{ input: { readOnly: true } }} name="addressinput" label="Adresse" type="text" className="w-[200px] mx-auto" placeholder="Adresse" variant="filled" value={report?.data.address} />
                        <TextField slotProps={{ input: { readOnly: true } }} name="postnrinput" label="Postnr." type="text" className="w-[100px] mx-auto" placeholder="Postnr." variant="filled" value={report?.data.postalcode} />
                        <TextField slotProps={{ input: { readOnly: true } }} name="poststedinput" label="Poststed" type="text" className="w-[200px] mx-auto" placeholder="Poststed" variant="filled" value={report?.data.postalplace} />
                    </Box>
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
                    <h1 className="text-xl text-center mt-6">Tiltaket gjelder</h1>
                    <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
                        <RadioGroup row aria-label="tiltak" name="tiltak" className="flex justify-center" value={report.data.type} aria-readonly>
                            <Box >
                                <Radio disabled={report.data.type !== "nybygg"} readOnly={true} name="tiltak" value="nybygg" /> Nybygg, påbygg mv.
                            </Box>
                            <Box>
                                <Radio disabled={report.data.type !== "ombygging"} readOnly={true} name="tiltak" value="ombygging" /> Rehabilitering

                            </Box>
                            <Box>
                                <Radio disabled={report.data.type !== "rivning"} readOnly={true} name="tiltak" value="rivning" /> Riving
                            </Box>
                        </RadioGroup>
                        <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                            <TextField slotProps={{ input: { readOnly: true } }} name="berortbrainput" label="Berørt BRA (m²)" type="text" className="w-[200px] mx-auto" placeholder="0m²" variant="filled" value={report?.data.berortbra} />
                            <TextField slotProps={{ input: { readOnly: true } }} name="bygningstypeinput" label="Bygningstype (GAB)" type="text" className="w-[200px] mx-auto" placeholder="Bygningstype" variant="filled" value={report?.data.bygningstype} />
                            <TextField slotProps={{ input: { readOnly: true } }} name="konstruksjonstypeinput" label="Konstruksjonstype" type="text" className="w-[200px] mx-auto" placeholder="Konstruksjonstype" variant="filled" value={report?.data.konstruksjonstype} />
                        </Box>
                    </Box>
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
                    <h1 className="text-xl text-center mt-6">Kort beskrivelse av prosjektet og avfallshåndteringen</h1>
                    <Box width={"100%"} display={"flex"} justifyContent={"start"}>
                        <TextField slotProps={{ input: { readOnly: true } }} minRows={3} maxRows={9} multiline required name="beskrivelseinput" label="Beskrivelse" type="text" className="max-w-[400px] w-full mx-auto" placeholder="Beskrivelse" value={report?.data.handtering} />
                    </Box>
                </Box>

                <Box>
                    <Typography className="text-lg mt-6" marginTop={2} fontSize={20} marginBottom={2}>Avfall</Typography>
                    <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                        <TableContainer className='max-w-[1200px]'>
                            <Table >
                                <TableHead className="bg-blue-100 border ">
                                    <TableRow className="">
                                        <TableCell></TableCell>
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
                                        report.data.materialer.length == 0 && <TableRow><TableCell colSpan={8}><Typography>Ingen registert avfall</Typography></TableCell></TableRow>
                                    }
                                    {report.data.materialer.length > 0 &&
                                        report.data.materialer.map((material) => <TableRow key={material.id} className="border-b">
                                            <TableCell className="border-r">
                                                <Typography className="font-bold p-3">
                                                    {material.navn}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="border-r">
                                                {material.planlagtmengde}
                                            </TableCell>
                                            <TableCell className="border-r">
                                                {material.faktiskmengde}
                                            </TableCell>

                                            <TableCell className="border-r">
                                               {material.faktiskmengde - material.planlagtmengde}
                                            </TableCell>
                                            <TableCell className="border-r">
                                                {material.mengdetilanlegg}
                                            </TableCell>
                                            <TableCell className="border-r">
                                                {material.mengdetilgjenbruk}
                                            </TableCell>
                                            <TableCell className="border-r">
                                                {material.anlegg}
                                            </TableCell>

                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                </Box>

            </FormControl>
        }

    </Box>
};