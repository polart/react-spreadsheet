import { evaluate } from "./expression";

test("(2 + A1) / A2", () => {
    const expr = "(2 + A1) / A2";
    const cells = {
        A1: 10,
        A2: 2,
    };
    const answer = evaluate(expr, cells);
    expect(answer).toEqual(6);
});

test("2 * 2 + 10 / 2 - 2^3", () => {
    const expr = "2 * 2 + 10 / 2 - 2^3";
    const cells = {};
    const answer = evaluate(expr, cells);
    expect(answer).toEqual(1);
});

// TODO: errors
