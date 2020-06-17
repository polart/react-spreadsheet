import React from "react";
import { TableHeadProps } from "./types";

export const TableHead: React.FC<TableHeadProps> = (props) => {
    const cols = props.sheetConfig.cols.map((c) => {
        const isActiveCol = c === props.activeCell.colId;
        return (
            <th className={`${isActiveCol ? "ActiveCol" : ""}`} key={c}>
                {c}
            </th>
        );
    });
    return (
        <thead>
            <tr>
                <th></th>
                {cols}
            </tr>
        </thead>
    );
};
