import React from "react";
import { TableRow } from "./Row";
import { TableProps } from "./types";

export const TableBody: React.FC<TableProps> = (props) => {
    const rows = props.sheetConfig.rows.map((_, i) => (
        <TableRow
            rowId={i + 1}
            key={i}
            activeCell={props.activeCell}
            setActiveCell={props.setActiveCell}
            tableState={props.tableState}
            sheetConfig={props.sheetConfig}
            setTableState={props.setTableState}
        />
    ));
    return <tbody>{rows}</tbody>;
};
