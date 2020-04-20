type TokenType = "number" | "operator" | "separator" | "cell";

interface Token {
    type: TokenType;
    value: string;
}

type NumberNode = { number: string };
type CellNode = { cell: string };
type UnaryNode = { unary: { operator: string; expr: Tree } };

type Tree =
    | { binary: { operator: string; left: Tree; right: Tree } }
    | UnaryNode
    | NumberNode
    | { cell: string };

type Context = {
    cells: { [key: string]: string | number };
};

export class Tokenizer {
    static TOKEN_TYPES: Array<[TokenType, RegExp]> = [
        ["number", /^[0-9]+(\.[0-9])*/],
        ["operator", /^[-+*/^]/],
        ["separator", /^[()]/],
        ["cell", /^[A-Z]+[0-9]+/],
    ];

    code: string;
    cells: Set<string>;
    constructor(code: string) {
        this.code = code;
        this.cells = new Set();
    }

    tokenize() {
        const tokens = [];
        while (this.code.length) {
            const { type, value } = this.tokenize_one_token();
            tokens.push({ type, value });
            this.code = this.code.trim();
            if (type === "cell") {
                this.cells.add(value);
            }
        }
        return {
            tokens,
            dependsOnCells: this.cells,
        };
    }

    tokenize_one_token(): Token {
        for (const [type, re] of Tokenizer.TOKEN_TYPES) {
            const match = this.code.match(re);
            if (match) {
                const value = match[0];
                this.code = this.code.slice(value.length);
                return { type, value };
            }
        }

        throw Error(`Couldn't match token on ${JSON.stringify(this.code)}`);
    }
}

class Parser {
    tokens: Token[];
    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): Tree {
        const tree = this.parseAdditive();
        if (this.tokens.length) {
            throw Error(`Can't handle token ${JSON.stringify(this.peek())}`);
        }
        return tree;
    }

    parseAdditive(): Tree {
        let expr = this.parseMultiplicative();
        let token = this.peek();
        while (
            token &&
            token.type === "operator" &&
            (token.value === "+" || token.value === "-")
        ) {
            this.consume();
            expr = {
                binary: {
                    operator: token.value,
                    left: expr,
                    right: this.parseMultiplicative(),
                },
            };
            token = this.peek();
        }
        return expr;
    }

    parseMultiplicative(): Tree {
        let expr = this.parseUnary();
        let token = this.peek();
        while (
            token &&
            token.type === "operator" &&
            (token.value === "*" || token.value === "/" || token.value === "^")
        ) {
            this.consume();
            expr = {
                binary: {
                    operator: token.value,
                    left: expr,
                    right: this.parseUnary(),
                },
            };
            token = this.peek();
        }
        return expr;
    }

    parseUnary(): Tree {
        let token = this.peek();
        if (
            token.type === "operator" &&
            (token.value === "+" || token.value === "-")
        ) {
            this.consume();
            return {
                unary: {
                    operator: token.value,
                    expr: this.parseUnary(),
                },
            };
        }

        return this.parsePrimary();
    }

    parsePrimary(): Tree {
        let token = this.peek();

        if (token && token.type === "number") {
            this.consume();
            return {
                number: token.value,
            };
        }

        if (token && token.type === "cell") {
            this.consume();
            return {
                cell: token.value,
            };
        }

        if (token && token.type === "separator" && token.value === "(") {
            this.consume();
            const expr = this.parseAdditive();
            token = this.consume();
            if (!(token.type === "separator" && token.value === ")")) {
                throw Error(
                    `Expecting token ), but found ${JSON.stringify(token)}`
                );
            }
            return expr;
        }

        throw Error(`Can't handle token ${JSON.stringify(token)}`);
    }

    consume() {
        const token = this.tokens.shift();
        if (!token) {
            throw Error("No tokens to consume");
        }
        return token;
    }

    peek() {
        return this.tokens[0];
    }
}

class Generator {
    node: Tree;
    context: Context;
    constructor(node: Tree, context: Context) {
        this.node = node;
        this.context = context;
    }

    generate() {
        return this.exec(this.node);
    }

    exec(node: any) {
        const type = this.getType(node);
        switch (type) {
            case "number":
                return this.execNumber(node);
            case "cell":
                return this.execCell(node);
            case "unary":
                return this.execUnary(node);
            case "binary":
                return this.execBinary(node.binary);
            default:
                throw Error(`Can't exec node ${JSON.stringify(node)}`);
        }
    }

    getType(node: Tree) {
        for (const type of ["number", "cell", "unary", "binary"]) {
            if (node.hasOwnProperty(type)) {
                return type;
            }
        }
        throw Error(`Can't determine a type of node ${JSON.stringify(node)}`);
    }

    execNumber(node: NumberNode) {
        return parseFloat(node.number);
    }

    execCell(node: CellNode): string | number {
        if (this.context.cells.hasOwnProperty(node.cell)) {
            return this.context.cells[node.cell];
        }
        throw Error(`Value not found for cell ${node.cell}`);
    }

    execUnary(node: UnaryNode): number {
        const expr: any = this.exec(node.unary.expr);
        switch (node.unary.operator) {
            case "+":
                return parseFloat(expr);
            case "-":
                return -parseFloat(expr);
            default:
                throw Error(`Unknown operator ${node.unary.operator}`);
        }
    }

    execBinary(node: any): number {
        const left: any = this.exec(node.left);
        const right: any = this.exec(node.right);
        switch (node.operator) {
            case "+":
                return parseFloat(left) + parseFloat(right);
            case "-":
                return parseFloat(left) - parseFloat(right);
            case "*":
                return parseFloat(left) * parseFloat(right);
            case "/":
                return parseFloat(left) / parseFloat(right);
            case "^":
                return parseFloat(left) ** parseFloat(right);
            default:
                throw Error(`Unknown operator ${node.operator}`);
        }
    }
}

const CONTEXT = {
    funcs: {},
    cells: {},
};

export const evaluate = (
    str: string,
    cellData: { [key: string]: string | number }
) => {
    try {
        const { tokens } = new Tokenizer(str).tokenize();
        const tree = new Parser(tokens).parse();
        return new Generator(tree, {
            ...CONTEXT,
            cells: cellData,
        }).generate();
    } catch(e) {
        return '#ERR!'
    }

};
