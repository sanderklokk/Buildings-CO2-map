import { Button, Popover, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { TableCellProps } from "@mui/material/TableCell";
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useBoundStore } from "../../store/Store";
import { WASTE_MATERIALS, WasteMaterial } from "../../assets/data";

export const AvfallsMaterialeRow = ({ materialId }:{ materialId: string}) => {

    const { updateAvfallRow, wasteReport }  = useBoundStore().wasteReportForm;

    const material = WASTE_MATERIALS.find((material: WasteMaterial) => material.id === materialId);
    if (!material) return null;
    const getAvfallRow = () => {
        return wasteReport.avfall.ordinert.find((i) => i.id === materialId) || wasteReport.avfall.farlig.find((i) => i.id === materialId);
    }

    const cellProps: TableCellProps = {
        padding: "none",
        className: "border",
    }

    return <TableRow>
        <TableCell {...cellProps}>
            <Typography className="font-bold p-3">
                {material.name}
            </Typography>
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth type="number" value={getAvfallRow()?.plannedAmount == 0 ? "" : getAvfallRow()?.plannedAmount} onChange={(e) => updateAvfallRow(material.id, { plannedAmount: e.target.value == "" ? 0 : parseFloat(e.target.value) })} />
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth type="number" value={getAvfallRow()?.actualAmount == 0 ? "" : getAvfallRow()?.actualAmount} onChange={(e) => updateAvfallRow(material.id, { actualAmount: e.target.value == "" ? 0 : parseFloat(e.target.value) })} />
        </TableCell>

        <TableCell {...cellProps}>
            <Typography className="text-center">{getAvfallRow()?.actualAmount != null && getAvfallRow()?.plannedAmount != null && (getAvfallRow()?.actualAmount || 0) - (getAvfallRow()?.plannedAmount || 0)}</Typography>
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth className="w-full m-0" type="number" value={getAvfallRow()?.amountToFacility == 0 ? "" : getAvfallRow()?.amountToFacility} onChange={(e) => updateAvfallRow(material.id, { amountToFacility: e.target.value == "" ? 0 : parseFloat(e.target.value) })} />
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="0 (t)" fullWidth type="number" value={getAvfallRow()?.amountToReuse == 0 ? "" : getAvfallRow()?.amountToReuse} onChange={(e) => updateAvfallRow(material.id, { amountToReuse: e.target.value == "" ? 0 : parseFloat(e.target.value) })} />
        </TableCell>
        <TableCell {...cellProps}>
            <TextField placeholder="-" fullWidth value={getAvfallRow()?.facility} onChange={(e) => updateAvfallRow(material.id, { facility: e.target.value })} />
        </TableCell>
        <TableCell width={1} {...cellProps}>
            <MoreIconPopup id={material.id} />
        </TableCell>
    </TableRow>
}

const MoreIconPopup = ({id}: {id: string}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { removeAvfallRow } = useBoundStore().wasteReportForm;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        removeAvfallRow(id);
    }

    const open = Boolean(anchorEl);
  

    return <div>
        <Button size="small" onClick={handleClick} variant="text" className="cursor-pointer">
            <MoreVertIcon />
        </Button>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Button variant="text"  size="medium" onClick={handleDelete}>
                Slett</Button>
        </Popover>
    </div>

}