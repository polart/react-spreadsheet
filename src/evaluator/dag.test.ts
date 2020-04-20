import { getOrder, DagCycleError } from "./dag";

test("simple", () => {
    const cells = {
        A1: {
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(["A2"]),
        },
        A2: {
            dependsOn: new Set<string>(["A1", "A3"]),
            dependentOn: new Set<string>(),
        },
        A3: {
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(["A2"]),
        },
    };
    const answer = getOrder(cells);
    expect(answer).toEqual(["A1", "A3", "A2"]);
});

test("empty", () => {
    const cells = {
        A1: { dependsOn: new Set<string>(), dependentOn: new Set<string>() },
        A2: { dependsOn: new Set<string>(), dependentOn: new Set<string>() },
        A3: { dependsOn: new Set<string>(), dependentOn: new Set<string>() },
    };
    const answer = getOrder(cells);
    expect(answer).toEqual(["A1", "A2", "A3"]);
});

test("cycle", () => {
    const cells = {
        A1: {
            dependsOn: new Set<string>(["A2"]),
            dependentOn: new Set<string>(["A3"]),
        },
        A2: {
            dependsOn: new Set<string>(["A3"]),
            dependentOn: new Set<string>(["A2"]),
        },
        A3: {
            dependsOn: new Set<string>(["A1"]),
            dependentOn: new Set<string>(["A1"]),
        },
    };
    expect(() => getOrder(cells)).toThrowError(DagCycleError);
});

test("complex", () => {
    const cells = {
        A2: {
            dependsOn: new Set<string>(["A11"]),
            dependentOn: new Set<string>(),
        },
        A3: {
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(["A10", "A8"]),
        },
        A5: {
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(["A11"]),
        },
        A7: {
            dependsOn: new Set<string>(),
            dependentOn: new Set<string>(["A11", "A8"]),
        },
        A8: {
            dependsOn: new Set<string>(["A7", "A3"]),
            dependentOn: new Set<string>(["A9"]),
        },
        A9: {
            dependsOn: new Set<string>(["A11", "A8"]),
            dependentOn: new Set<string>(),
        },
        A10: {
            dependsOn: new Set<string>(["A3", "A11"]),
            dependentOn: new Set<string>(),
        },
        A11: {
            dependsOn: new Set<string>(["A5", "A7"]),
            dependentOn: new Set<string>(["A2", "A9", "A10"]),
        },
    };
    const answer = getOrder(cells);
    expect(answer).toEqual(["A3", "A5", "A7", "A11", "A8", "A2", "A10", "A9"]);
});
