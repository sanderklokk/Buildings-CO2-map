import { TableCell, TableRow, TextField, Typography } from "@mui/material";
import { TableCellProps } from "@mui/material/TableCell";
import { useState } from "react";
import { WasteMaterial } from "../../assets/data";

export interface WasteMaterialRowProps {
    wasteMaterial: WasteMaterial;
}

export interface AvfallsMaterialeRow {
    plannedAmount: number;
    actualAmount: number;
    amountToFacility: number;
    amountToReuse: number;
    facility: string;
}

export const AvfallsMaterialeRow = ({ wasteMaterial }: WasteMaterialRowProps) => {
    const [plannedAmount, setPlannedAmount] = useState<number | undefined>(0);
    const [actualAmount, setActualAmount] = useState<number>(0);
    const [amountToFacility, setAmountToFacility] = useState<number>(0);
    const [amountToReuse, setAmountToReuse] = useState<number>(0);
    const [facility, setFacility] = useState<string>("");


    const cellProps: TableCellProps = {
        padding: "none",
        className: "border",
    }

    return <TableRow>
        <TableCell {...cellProps}>
            <Typography className="font-bold p-3">
                {wasteMaterial.name}
            </Typography>
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth type="number" value={plannedAmount == 0 ? "" : plannedAmount} onChange={(e) => setPlannedAmount(e.target.value == "" ? 0 : parseFloat(e.target.value))} />
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth type="number" value={actualAmount == 0 ? "" : actualAmount} onChange={(e) => setActualAmount(e.target.value == "" ? 0 : parseFloat(e.target.value))} />
        </TableCell>

        <TableCell {...cellProps}>
            <Typography className="text-center">{actualAmount != null && plannedAmount != null && actualAmount - plannedAmount}</Typography>
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth className="w-full m-0" type="number" value={amountToFacility == 0 ? "" : amountToFacility} onChange={(e) => setAmountToFacility(e.target.value == "" ? 0 : parseFloat(e.target.value))} />
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth type="number" value={amountToReuse == 0 ? "" : amountToReuse} onChange={(e) => setAmountToReuse(e.target.value == "" ? 0 : parseFloat(e.target.value))} />
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="-" fullWidth value={facility} onChange={(e) => setFacility(e.target.value)} />
        </TableCell>
    </TableRow>
}