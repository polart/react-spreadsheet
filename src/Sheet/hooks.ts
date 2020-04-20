import {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { recalculateSheet } from "../evaluator";
import { COLS, LETTERS, ROWS } from "./constants";
import { SheetConfig, State } from "./types";
import { getQueryStringValue, storeStateInUrl } from "./utils";

export const useSheetConfig = () => {
    const [colsNum] = useState(
        parseInt(getQueryStringValue("c") || COLS.toString())
    );
    const [rowsNum] = useState(
        parseInt(getQueryStringValue("r") || ROWS.toString())
    );

    const sheetConfig = useMemo(
        () =>
            ({
                rowsNum: rowsNum,
                colsNum: colsNum,
                cols: LETTERS.slice(0, colsNum),
                rows: Array(rowsNum)
                    .fill(null)
                    .map((_, i) => i + 1),
            } as SheetConfig),
        [colsNum, rowsNum]
    );
    return sheetConfig;
};

export const useSheetState = (sheetConfig: SheetConfig) => {
    const initialSheetState = useMemo(() => {
        const state: State = {};
        sheetConfig.cols.forEach((c) => {
            sheetConfig.rows.forEach((_, r) => {
                state[`${c}${r + 1}`] = {
                    value: "",
                    formula: getQueryStringValue(`${c}${r + 1}`) || "",
                    dependsOn: new Set(),
                    dependentOn: new Set(),
                };
            });
        });
        return recalculateSheet(state);
    }, [sheetConfig]);

    const [sheetState, setSheetState] = useState<State>(initialSheetState);

    const onSetSheetState = useCallback(
        (newState: State) => {
            setSheetState(newState);
            storeStateInUrl(newState, sheetConfig);
        },
        [sheetConfig]
    );

    return [sheetState, onSetSheetState] as [
        State,
        Dispatch<SetStateAction<State>>
    ];
};

export const useFocus = () => {
    const htmlElRef = useRef<HTMLElement>(null);
    const setFocus = () => {
        const currentEl = htmlElRef.current;
        currentEl && currentEl.focus();
    };
    return [htmlElRef, setFocus] as const;
};
