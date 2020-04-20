import { Dispatch, SetStateAction } from "react";

export interface StateDependencies {
    [key: string]: {
        dependsOn: Set<string>;
        dependentOn: Set<string>;
    };
}

export interface State {
    [key: string]: {
        value: string;
        formula: string;
        dependsOn: Set<string>;
        dependentOn: Set<string>;
    };
}

export interface TableCellProps {
    rowId: number;
    colId: string;
    activeCell: ActiveCell;
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>;
    tableState: State;
    setTableState: Dispatch<SetStateAction<State>>;
}

export interface ActiveCell {
    rowId: number;
    colId: string;
    mode: "select" | "edit";
}

export interface TableProps {
    activeCell: ActiveCell;
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>;
    tableState: State;
    setTableState: Dispatch<SetStateAction<State>>;
    sheetConfig: SheetConfig;
}

export interface TableHeadProps {
    sheetConfig: SheetConfig;
}

export interface TableRowProps {
    rowId: number;
    activeCell: ActiveCell;
    setActiveCell: Dispatch<SetStateAction<ActiveCell>>;
    tableState: State;
    setTableState: Dispatch<SetStateAction<State>>;
    sheetConfig: SheetConfig;
}

export interface SheetConfig {
    cols: string[];
    colsNum: number;
    rows: number[];
    rowsNum: number;
}
