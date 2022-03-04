
import { Token } from "./tokenizer";
import {Ast} from "./ast";
import { FunctionDeclarationParse} from "./functionDeclaration";
import { VariableDeclarationParseConst,VariableDeclarationParseLet,VariableDeclarationParseVar } from "./variableDeclaration";
import { tokensTake } from "./tokensHelps";


interface ParseContext {
    eat: (start: number, end: number) => Token[];
    getToken(): ReturnType<typeof tokensTake>;
    addParseToken(t: KeywordParse): ParseContext;
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

const composeParse = (tokens: Array<Token>):ParseContext => {
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
            return tokensTake(copyTokens);
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
    p.addParseToken(VariableDeclarationParseConst)
    .addParseToken(VariableDeclarationParseLet)
    .addParseToken(VariableDeclarationParseVar)
    .addParseToken(FunctionDeclarationParse)
    return () => p.runParse()
}