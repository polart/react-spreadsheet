import { recalculateSheet } from "./";

test("recalculateSheet", () => {
    const state = {
        A1: {
            value: "",
            formula: "=(A2 + A4) * 2",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
        A2: {
            value: "2",
            formula: "2",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
        A3: {
            value: "",
            formula: "=A1 * A4",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
        A4: {
            value: "3",
            formula: "3",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
    };

    const answer = recalculateSheet(state);
    expect(answer).toEqual({
        A1: {
            value: "10",
            formula: "=(A2 + A4) * 2",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
        A2: {
            value: "2",
            formula: "2",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
        A3: {
            value: "30",
            formula: "=A1 * A4",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
        A4: {
            value: "3",
            formula: "3",
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(),
        },
    });
});
