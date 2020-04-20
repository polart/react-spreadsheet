import React, { ChangeEvent } from "react";
import { recalculateSheet } from "../evaluator";
import { TableCellProps } from "./types";

export const TableCell: React.FC<TableCellProps> = (props) => {
    const onClick = () => {
        if (isSelectedCell) {
            return;
        }
        props.setActiveCell({
            rowId: props.rowId,
            colId: props.colId,
            mode: "select",
        });
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const data = {
            ...cellData,
            value: e.target.value.startsWith("=")
                ? e.target.value.slice(1)
                : e.target.value,
            formula: e.target.value,
        };
        props.setTableState({
            ...props.tableState,
            [`${props.colId}${props.rowId}`]: data,
        });
    };

    const onBlur = () => {
        const newState = recalculateSheet(props.tableState);
        props.setTableState(newState);
    };

    const isSelectedCell =
        props.activeCell.colId === props.colId &&
        props.activeCell.rowId === props.rowId;

    const cellData = props.tableState[`${props.colId}${props.rowId}`];
    let cellValue;
    if (isSelectedCell && props.activeCell.mode === "edit") {
        cellValue = (
            <input
                autoFocus
                value={cellData.formula}
                onChange={onInputChange}
                onBlur={onBlur}
            ></input>
        );
    } else {
        cellValue = <span>{cellData.value}</span>;
    }

    return (
        <td
            className={`${isSelectedCell ? "ActiveCell" : ""} ${
                isSelectedCell && props.activeCell.mode === "edit"
                    ? "EditCell"
                    : ""
            }`}
            onClick={onClick}
        >
            {cellValue}
        </td>
    );
};
