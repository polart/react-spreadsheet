import { SheetConfig, State } from "./types";

export const getQueryStringValue = (key: string) => {
    return new URLSearchParams(window.location.search).get(key);
};

export const storeStateInUrl = (state: State, sheetConfig: SheetConfig) => {
    const formulas = Object.entries(state)
        .filter(([_, data]) => data.formula.length)
        .reduce((obj, [cellId, data]) => {
            obj[cellId] = data.formula;
            return obj;
        }, {} as { [key: string]: string });

    const newSearchParamsObj = {
        ...formulas,
        ...{
            c: sheetConfig.colsNum.toString(),
            r: sheetConfig.rowsNum.toString(),
        },
    };
    const newParams = new URLSearchParams(newSearchParamsObj).toString();
    window.history.pushState(
        newSearchParamsObj,
        "",
        `${window.location.pathname}?${newParams}`
    );
};
