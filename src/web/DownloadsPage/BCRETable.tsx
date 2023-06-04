import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { Button } from '@zscreen/psychscreen-ui-components';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export type DataRow = {
    name: string;
    group: string;
    elements: number;
    fileSize: number;
    url: string;
};

type BEDFileDownloadTableProps = {
    defaultRows: DataRow[];
    extraRows: DataRow[];
    colorGroups: { [group: string]: string };
    title: string;
    elementText?: string;
};

const BEDFileDownloadTable: React.FC<BEDFileDownloadTableProps>
    = ({ defaultRows, extraRows, colorGroups, title, elementText }) => {

        // Whether or not bCRE subset rows are displayed
        // Default is hidden; a "show more subsets" row toggles them on
        const [ expanded, setExpanded ] = React.useState(false);
        const displayedRows = expanded ? [ ...defaultRows, ...extraRows ] : defaultRows;
        const toggleRowMessage = expanded ? `hide ${extraRows.length} rows` : `show ${extraRows.length} more`;
        const ToggleRowIcon = expanded ? ExpandLessIcon : ExpandMoreIcon;

        return (
            <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <strong>{title}</strong>
                            </StyledTableCell>
                            <StyledTableCell># elements</StyledTableCell>
                            <StyledTableCell colSpan={2}>file size</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { displayedRows.map((row) => (
                            <StyledTableRow key={row.name} style={{ backgroundColor: colorGroups[row.group] }}>
                                <StyledTableCell component="th" scope="row">
                                    <strong>{row.name}</strong>
                                </StyledTableCell>
                                <StyledTableCell>
                                    {row.elements.toLocaleString()} {elementText || "elements"}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {(row.fileSize / 1e6).toFixed(0)} MB
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <a href={row.url} download style={{ textDecoration: "none" }}>
                                        <Button bvariant="filled" btheme="light">
                                            <DownloadIcon /> Download
                                        </Button>
                                    </a>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        <StyledTableRow style={{ backgroundColor: "#eeeeee", cursor: 'pointer' }}>
                            <StyledTableCell colSpan={4} onClick={() => setExpanded(!expanded)}>
                                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', justifyContent: 'center' }}>
                                    <span>{toggleRowMessage}</span> <ToggleRowIcon />
                                </div>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );

    };

export default BEDFileDownloadTable;
