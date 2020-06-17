import React from "react";
import { TableCell } from "./Cell";
import { TableRowProps } from "./types";

export const TableRow: React.FC<TableRowProps> = (props) => {
    const isActiveRow = props.rowId === props.activeCell.rowId;
    const cols = props.sheetConfig.cols.map((l) => (
        <TableCell
            rowId={props.rowId}
            colId={l}
            key={l}
            activeCell={props.activeCell}
            setActiveCell={props.setActiveCell}
            tableState={props.tableState}
            setTableState={props.setTableState}
        />
    ));
    return (
        <tr className={`${isActiveRow ? "ActiveRow" : ""}`}>
            <td>{props.rowId}</td>
            {cols}
        </tr>
    );
};
