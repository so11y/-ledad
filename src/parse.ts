
import { Token } from "./tokenizer";
import { VariableDeclarationParse } from "./variableDeclaration";

export abstract class Ast {
    start: number = 0;
    end: number = 0;
    type: string = null;
}

export interface AstConstructor {
    new(): Ast;
}

interface ParseContext {
    eat: (start: number, end: number) => Token[];
    getToken(): {
        getIndex(): number;
        next(): Token;
    };
    addParseToken(t: KeywordParse): any;
    walk(current: Token): Ast;
    runParse(): {
        type: string;
        body: Ast[];
    };
}

export interface ParseTransform {
    (token: Token, context: ParseContext): Ast | null;
}

interface KeywordParse {
    kind: string;
    transform: ParseTransform;
}

const composeParse = (tokens: Array<Token>) => {
    const copyTokens = tokens.slice(0);
    const keyWordMap = new Map<string, KeywordParse>();

    const ast = {
        type: "Program",
        body: [] as Ast[],

    }

    const parseContext = {
        eat: (start: number, end: number) => {
            return copyTokens.splice(start, end);
        },
        getToken() {
            let index = 0;
            return {
                getIndex() {
                    return index;
                },
                next() {
                    return copyTokens[index++];
                }
            }
        },
        addParseToken(t: KeywordParse) {
            keyWordMap.set(t.kind, t);
            return this;
        },
        walk(current: Token) {
            if (keyWordMap.has(current.value)) {
                const createAST = keyWordMap.get(current.value).transform(current, parseContext);
                return createAST;
            }
        },
        runParse() {
            while (copyTokens.length) {
                const current = copyTokens.shift();
                const node = this.walk(current);
                if (node) {
                    ast.body.push(node);
                }
            }
            return ast
        },
    }

    return parseContext
}

export const parse = (tokens: Array<Token>) => {
    const p = composeParse(tokens);
    p.addParseToken(VariableDeclarationParse)
    return () => p.runParse()
}