
import { Token } from "./tokenizer";
import { Ast } from "./AstTypes/ast";
import { FunctionDeclarationParse } from "./Ast/functionDeclaration";
import { ObjectExpressionParse } from "./Ast/objectExpression";
import { VariableDeclarationParseConst, VariableDeclarationParseLet, VariableDeclarationParseVar } from "./Ast/variableDeclaration";
import { tokensTake } from "./tokensHelps";


interface ParseContext {
    eat: (start: number, end: number) => Token[];
    getToken(): ReturnType<typeof tokensTake>;
    walk(current: Token): Ast;
    runParse(ast: Array<Ast>): void;
}

export type TransformContext = ParseContext ;
export interface ParseTransform {
    (token: Token, context: TransformContext): Ast | null;
}
interface KeywordParse {
    kind: string;
    transform: ParseTransform;
}
const keyWordMap = new Map<string, KeywordParse>();

export const composeParse = (tokens: Array<Token>): ParseContext => {
    const copyTokens = tokens.slice(0);

    const parseContext = {
        eat: (start: number, end: number) => {
            return tokens.splice(start, end);
        },
        getToken() {
            return tokensTake(copyTokens);
        },
        walk(current: Token) {
            if (keyWordMap.has(current.value)) {
                const createAST = keyWordMap.get(current.value).transform(current, parseContext);
                return createAST;
            }
        },
        runParse(ast: Array<Ast>) {
            while (copyTokens.length) {
                const current = copyTokens.shift();
                const node = this.walk(current);
                if (node) {
                    ast.push(node);
                }
            }
        },
    }
    return parseContext;
}
const parseAdd = (t: KeywordParse) => {
    keyWordMap.set(t.kind, t);
}

const parseInit = () => {
    parseAdd(VariableDeclarationParseConst)
    parseAdd(VariableDeclarationParseLet)
    parseAdd(VariableDeclarationParseVar)
    parseAdd(FunctionDeclarationParse)
    parseAdd(ObjectExpressionParse)
}

export const parse = (tokens: Array<Token>) => {
    const ast = {
        type: "Program",
        body: [] as Ast[],
    }
    parseInit();
    composeParse(tokens).runParse(ast.body)
    return ast
}