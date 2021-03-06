export class DagCycleError extends Error {
    cell: string;
    constructor(message: string, cell: string) {
        super(message);
        this.name = "DagCycleError";
        this.cell = cell;
    }
}

// Uses Kahn's_algorithm to calculate topological order of DAG
// https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm
export const getOrder = (cells: {
    [key: string]: { dependsOn: Set<string>; dependentOn: Set<string> };
}) => {
    const ordered: string[] = [];
    const set: Set<string> = new Set();

    for (let [key, { dependsOn }] of Object.entries(cells)) {
        if (!dependsOn.size) {
            set.add(key);
        }
    }

    while (set.size) {
        const cell = Array.from(set)[0];
        set.delete(cell);
        ordered.push(cell);

        for (let m of Array.from(cells[cell].dependentOn)) {
            cells[cell].dependentOn.delete(m);
            cells[m].dependsOn.delete(cell);
            if (!cells[m].dependsOn.size) {
                set.add(m);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [cell, { dependsOn, dependentOn }] of Object.entries(cells)) {
        if (dependsOn.size || dependentOn.size) {
            throw new DagCycleError("Graph contains at least one cycle", cell);
        }
    }

    return ordered;
};
