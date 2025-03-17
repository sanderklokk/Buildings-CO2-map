import { Box, Radio, RadioGroup, TextField } from "@mui/material";
import { useState } from "react";


export interface EiendomData {
    address: string;
    postalCode: string;
    postalPlace: string;
}

export interface TiltakData {
    berortBRA: number;
    bygningstype: string;
    konstruksjonstype: string;
    handtering: string;
}

export const GjelderForm = () => {

    const [eiendomInput, setEiendomInput] = useState<EiendomData>({
        address: "",
        postalCode: "",
        postalPlace: ""
    });

    const [tiltakInput, setTiltakInput] = useState<TiltakData>({
        berortBRA: 0,
        bygningstype: "",
        konstruksjonstype: "",
        handtering: ""
    });

    return <Box>
        <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
            <h1 className="text-xl text-center mt-6">Eiendom/Byggested</h1>
            <Box display={"flex"} flexWrap={"wrap"} gap={3} justifyContent={"center"} alignItems={"center"}>
                <TextField required name="addressinput" label="Adresse" type="text" className="w-[200px] mx-auto" placeholder="Adresse" variant="filled" value={eiendomInput.address} onChange={(e) => setEiendomInput({ ...eiendomInput, address: e.target.value })} />
                <TextField required name="postnrinput" label="Postnr." type="text" className="w-[100px] mx-auto" placeholder="Postnr." variant="filled" value={eiendomInput.postalCode} onChange={(e) => setEiendomInput({ ...eiendomInput, postalCode: e.target.value })} />
                <TextField required name="poststedinput" label="Poststed" type="text" className="w-[200px] mx-auto" placeholder="Poststed" variant="filled" value={eiendomInput.postalPlace} onChange={(e) => setEiendomInput({ ...eiendomInput, postalPlace: e.target.value })} />
            </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
            <h1 className="text-xl text-center mt-6">Tiltaket gjelder</h1>
            <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
                <RadioGroup row aria-label="tiltak" name="tiltak" defaultValue="nybygg" className="flex justify-center" onChange={(e) => setTiltakInput({ ...tiltakInput, handtering: e.target.value })}>
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
                    <TextField required name="berortbrainput" label="Berørt BRA (m²)" type="text" className="w-[200px] mx-auto" placeholder="0m²" variant="filled" value={tiltakInput.berortBRA} onChange={(e) => setTiltakInput({ ...tiltakInput, berortBRA: parseFloat(e.target.value) })} />
                    <TextField required name="bygningstypeinput" label="Bygningstype (GAB)" type="text" className="w-[200px] mx-auto" placeholder="Bygningstype" variant="filled" value={tiltakInput.bygningstype} onChange={(e) => setTiltakInput({ ...tiltakInput, bygningstype: e.target.value })} />
                    <TextField required name="konstruksjonstypeinput" label="Konstruksjonstype" type="text" className="w-[200px] mx-auto" placeholder="Konstruksjonstype" variant="filled" value={tiltakInput.konstruksjonstype} onChange={(e) => setTiltakInput({ ...tiltakInput, konstruksjonstype: e.target.value })} />
                </Box>
            </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={3} alignItems={"start"}>
            <h1 className="text-xl text-center mt-6">Kort beskrivelse av prosjektet og avfallshåndteringen</h1>
            <Box width={"100%"} display={"flex"} justifyContent={"start"}>
                <TextField minRows={3} maxRows={9} multiline required name="beskrivelseinput" label="Beskrivelse" type="text" className="max-w-[400px] w-full mx-auto" placeholder="Beskrivelse" value={tiltakInput.handtering} onChange={(e) => setTiltakInput({ ...tiltakInput, handtering: e.target.value })} />
            </Box>
        </Box>
    </Box>
}

