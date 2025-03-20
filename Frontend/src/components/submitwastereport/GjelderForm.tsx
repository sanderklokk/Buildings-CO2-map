import { Box, Radio, RadioGroup, TextField } from "@mui/material";
import { useBoundStore } from "../../store/Store";


export const GjelderForm = () => {

    const { setGjelder, wasteReport } = useBoundStore().wasteReportForm;

    return <Box>
        <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
            <h1 className="text-xl text-center mt-6">Eiendom/Byggested</h1>
            <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                <TextField required name="addressinput" label="Adresse" type="text" className="w-[200px] mx-auto" placeholder="Adresse" variant="filled" value={wasteReport.gjelder.eiendom.address} onChange={(e) => setGjelder({ ...wasteReport.gjelder, eiendom: { ...wasteReport.gjelder.eiendom, address: e.target.value} })} />
                <TextField required name="postnrinput" label="Postnr." type="text" className="w-[100px] mx-auto" placeholder="Postnr." variant="filled" value={wasteReport.gjelder.eiendom.postalCode} onChange={(e) => setGjelder({ ...wasteReport.gjelder, eiendom: { ...wasteReport.gjelder.eiendom, postalCode: e.target.value} })} />
                <TextField required name="poststedinput" label="Poststed" type="text" className="w-[200px] mx-auto" placeholder="Poststed" variant="filled" value={wasteReport.gjelder.eiendom.postalPlace} onChange={(e) => setGjelder({ ...wasteReport.gjelder, eiendom: { ...wasteReport.gjelder.eiendom, postalPlace: e.target.value} })} />
            </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
            <h1 className="text-xl text-center mt-6">Tiltaket gjelder</h1>
            <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
                <RadioGroup row aria-label="tiltak" name="tiltak" defaultValue="nybygg" className="flex justify-center" onChange={(e) => setGjelder({ ...wasteReport.gjelder, tiltak: { ...wasteReport.gjelder.tiltak, type: e.target.value } })}>
                    <Box>
                        <Radio name="tiltak" value="nybygg" /> Nybygg, påpygg mv.
                    </Box>
                    <Box>
                        <Radio name="tiltak" value="ombygging" /> Rehabilitering
                    </Box>
                    <Box>
                        <Radio name="tiltak" value="rivning" /> Riving
                    </Box>
                </RadioGroup>
                <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                    <TextField required name="berortbrainput" label="Berørt BRA (m²)" type="text" className="w-[200px] mx-auto" placeholder="0m²" variant="filled" value={wasteReport.gjelder.tiltak.berortBRA} onChange={(e) => setGjelder({ ...wasteReport.gjelder, tiltak: { ...wasteReport.gjelder.tiltak, berortBRA: parseFloat(e.target.value) } })} />
                    <TextField required name="bygningstypeinput" label="Bygningstype (GAB)" type="text" className="w-[200px] mx-auto" placeholder="Bygningstype" variant="filled" value={wasteReport.gjelder.tiltak.bygningstype} onChange={(e) => setGjelder({ ...wasteReport.gjelder, tiltak: { ...wasteReport.gjelder.tiltak, bygningstype: e.target.value } })} />
                    <TextField required name="konstruksjonstypeinput" label="Konstruksjonstype" type="text" className="w-[200px] mx-auto" placeholder="Konstruksjonstype" variant="filled" value={wasteReport.gjelder.tiltak.konstruksjonstype} onChange={(e) => setGjelder({ ...wasteReport.gjelder, tiltak: { ...wasteReport.gjelder.tiltak, konstruksjonstype: e.target.value } })} />
                </Box>
            </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
            <h1 className="text-xl text-center mt-6">Kort beskrivelse av prosjektet og avfallshåndteringen</h1>
            <Box width={"100%"} display={"flex"} justifyContent={"start"}>
                <TextField minRows={3} maxRows={9} multiline required name="beskrivelseinput" label="Beskrivelse" type="text" className="max-w-[400px] w-full mx-auto" placeholder="Beskrivelse" value={wasteReport.gjelder.tiltak.handtering} onChange={(e) => setGjelder({ ...wasteReport.gjelder, tiltak: { ...wasteReport.gjelder.tiltak, handtering: e.target.value } })} />
            </Box>
        </Box>
    </Box>
}

