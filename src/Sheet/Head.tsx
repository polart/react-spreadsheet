import React from "react";
import { TableHeadProps } from "./types";

export const TableHead: React.FC<TableHeadProps> = (props) => {
    const cols = props.sheetConfig.cols.map((l) => <th key={l}>{l}</th>);
    return (
        <thead>
            <tr>
                <th></th>
                {cols}
            </tr>
        </thead>
    );
};
