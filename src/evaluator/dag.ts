export class DagCycleError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DagCycleError";
    }
}

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
            // remove edge
            if (!cells[m].dependsOn.size) {
                set.add(m);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [_, { dependsOn, dependentOn }] of Object.entries(cells)) {
        if (dependsOn.size || dependentOn.size) {
            throw new DagCycleError("Graph contains at least one cycle");
        }
    }

    return ordered;
};
