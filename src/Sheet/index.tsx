import React, {
    Dispatch,
    KeyboardEvent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { recalculateSheet } from "../evaluator";
import { useFocus, useSheetConfig, useSheetState } from "./hooks";
import { TableBody } from "./Body";
import { TableHead } from "./Head";
import { ActiveCell, SheetConfig } from "./types";

const setActiveCellEdit = (
    activeCell: ActiveCell,
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>
) =>
    setActiveCell({
        rowId: activeCell.rowId,
        colId: activeCell.colId,
        mode: "edit",
    });

const setActiveCellArrowUp = (
    activeCell: ActiveCell,
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>
) =>
    setActiveCell({
        rowId: Math.max(activeCell.rowId - 1, 1),
        colId: activeCell.colId,
        mode: "select",
    });

const setActiveCellArrowDown = (
    activeCell: ActiveCell,
    sheetConfig: SheetConfig,
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>
) =>
    setActiveCell({
        rowId: Math.min(activeCell.rowId + 1, sheetConfig.rowsNum),
        colId: activeCell.colId,
        mode: "select",
    });

const setActiveCellArrowRight = (
    activeCell: ActiveCell,
    sheetConfig: SheetConfig,
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>
) =>
    setActiveCell({
        rowId: activeCell.rowId,
        colId:
            sheetConfig.cols[
                Math.min(
                    sheetConfig.cols.indexOf(activeCell.colId) + 1,
                    sheetConfig.colsNum - 1
                )
            ],
        mode: "select",
    });

const setActiveCellArrowLeft = (
    activeCell: ActiveCell,
    sheetConfig: SheetConfig,
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>
) =>
    setActiveCell({
        rowId: activeCell.rowId,
        colId:
            sheetConfig.cols[
                Math.max(sheetConfig.cols.indexOf(activeCell.colId) - 1, 0)
            ],
        mode: "select",
    });

export const Sheet = () => {
    const onKeyDown = (e: KeyboardEvent) => {
        if (activeCell.mode === "edit") {
            if (e.key === "Enter") {
                const newState = recalculateSheet(tableState);
                setTableState(newState);
                setActiveCellArrowDown(activeCell, sheetConfig, setActiveCell);
                // Focus is lost after Enter
                setTableFocus();
            }
            return;
        }

        if (e.key === "Enter") {
            setActiveCellEdit(activeCell, setActiveCell);
            return;
        }

        if (e.key === "Backspace" || e.key === "Delete") {
            const newState = recalculateSheet({
                ...tableState,
                [`${activeCell.colId}${activeCell.rowId}`]: {
                    ...cellData,
                    value: "",
                    formula: "",
                },
            });
            setTableState(newState);
            return;
        }

        if (e.key === "ArrowUp") {
            setActiveCellArrowUp(activeCell, setActiveCell);
            return;
        }

        if (e.key === "ArrowDown") {
            setActiveCellArrowDown(activeCell, sheetConfig, setActiveCell);
            return;
        }

        if (e.key === "ArrowRight") {
            setActiveCellArrowRight(activeCell, sheetConfig, setActiveCell);
            return;
        }

        if (e.key === "ArrowLeft") {
            setActiveCellArrowLeft(activeCell, sheetConfig, setActiveCell);
            return;
        }

        setActiveCellEdit(activeCell, setActiveCell);
        setTableState({
            ...tableState,
            [`${activeCell.colId}${activeCell.rowId}`]: {
                ...cellData,
                value: "",
                formula: "",
            },
        });
    };

    const [tableRef, setTableFocus] = useFocus();

    // Trigger table focus on page load
    useEffect(
        () => {
            setTableFocus();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const sheetConfig = useSheetConfig();
    const [tableState, setTableState] = useSheetState(sheetConfig);
    const [activeCell, setActiveCell] = useState<ActiveCell>({
        rowId: 1,
        colId: "A",
        mode: "select",
    });
    const cellData = tableState[`${activeCell.colId}${activeCell.rowId}`];
    return (
        <table
            onKeyDown={onKeyDown}
            tabIndex={-1}
            // @ts-ignore
            ref={tableRef}
        >
            <TableHead sheetConfig={sheetConfig} activeCell={activeCell} />
            <TableBody
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                tableState={tableState}
                sheetConfig={sheetConfig}
                setTableState={setTableState}
            />
        </table>
    );
};
