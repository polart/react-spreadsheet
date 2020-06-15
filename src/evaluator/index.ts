import { State, StateDependencies } from "../Sheet/types";
import { getOrder, DagCycleError } from "./dag";
import { evaluate, Tokenizer } from "./expression";

type Values = { [key: string]: string | number };

const cleanupDependencies = (state: State) => {
    Object.values(state).forEach((data) => {
        data.dependentOn = new Set<string>();
        data.dependsOn = new Set<string>();
    });
};

const fillInDependencies = (state: State) => {
    Object.entries(state).forEach(([cellId, data]) => {
        if (!data.formula.startsWith("=")) {
            return;
        }
        let dependsOnCells = new Set<string>();
        try {
            const ans = new Tokenizer(data.formula.slice(1)).tokenize();
            dependsOnCells = ans.dependsOnCells;
        } catch (e) {
            data.value = "#ERR!";
        }
        // const { dependsOnCells } = new Tokenizer(
        //     data.formula.slice(1)
        // ).tokenize();

        data.dependsOn = dependsOnCells;
        state[cellId] = data;
        for (let cell of Array.from(dependsOnCells)) {
            state[cell].dependentOn.add(cellId);
        }
    });
};

const getCellsOrder = (state: State) => {
    const dependencies = Object.entries(state)
        .filter(
            ([_, data]) =>
                data.value.length ||
                data.formula.length ||
                data.dependsOn.size ||
                data.dependentOn.size
        )
        .reduce((obj, [cellId, data]) => {
            obj[cellId] = {
                dependsOn: data.dependsOn,
                dependentOn: data.dependentOn,
            };
            return obj;
        }, {} as StateDependencies);

    return getOrder(dependencies);
};

const calcValues = (state: State, order: string[]) => {
    const values: Values = {};
    order.forEach((cell) => {
        const data = state[cell];
        if (data.formula.startsWith("=")) {
            data.value = evaluate(data.formula.slice(1), values).toString();
        } else {
            data.value = data.formula;
        }
        values[cell] = data.value;
    });
};

export const recalculateSheet = (state: State) => {
    const newState = { ...state };

    cleanupDependencies(newState);
    fillInDependencies(newState);
    try {
        const order = getCellsOrder(newState);
        calcValues(newState, order);
    } catch (e) {
        if (e instanceof DagCycleError) {
            newState[e.cell].value = "#REF!";
        }
    }

    return newState;
};
