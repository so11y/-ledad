
import { Token } from "./tokenizer";
import { Ast } from "./AstTypes/ast";
import { FunctionDeclarationParse } from "./Ast/functionDeclaration";
import { ObjectExpressionParse } from "./Ast/objectExpression";
import { VariableDeclarationParseConst, VariableDeclarationParseLet, VariableDeclarationParseVar } from "./Ast/variableDeclaration";
import { tokensTake } from "./tokensHelps";


interface ParseContext {
    eat: (start: number, end: number) => Token[];
    getToken(): ReturnType<typeof tokensTake>;
    addParseToken(t: KeywordParse): ParseContext;
    walk(current: Token): Ast;
    runParse(ast: Array<Ast>): Ast[]
}

interface CreateContext {
    (tokens: Token[]): ParseContext
}

export type TransformContext = ParseContext & { createContext: CreateContext };

export interface ParseTransform {
    (token: Token, context: TransformContext): Ast | null;
}


interface KeywordParse {
    kind: string;
    transform: ParseTransform;
}

const composeParse = (tokens: Array<Token>): ParseContext => {
    const copyTokens = tokens.slice(0);
    const keyWordMap = new Map<string, KeywordParse>();



    const createContext = (tokens: Array<Token>) => {
        const parseContext = {
            eat: (start: number, end: number) => {
                return tokens.splice(start, end);
            },
            getToken() {
                return tokensTake(tokens);
            },
            addParseToken(t: KeywordParse) {
                keyWordMap.set(t.kind, t);
                return this;
            },
            walk(current: Token) {
                if (keyWordMap.has(current.value)) {
                    const createAST = keyWordMap.get(current.value).transform(current, {
                        ...parseContext,
                        createContext
                    });
                    return createAST;
                }
            },
            runParse(ast: Array<Ast>) {
                while (tokens.length) {
                    const current = tokens.shift();
                    const node = this.walk(current);
                    if (node) {
                        ast.push(node);
                    }
                }
                return ast
            },
        }
        return parseContext;
    }
    return createContext(copyTokens)
}

export const parse = (tokens: Array<Token>) => {
    const ast = {
        type: "Program",
        body: [] as Ast[],
    }
    const p = composeParse(tokens);
    p.addParseToken(VariableDeclarationParseConst)
        .addParseToken(VariableDeclarationParseLet)
        .addParseToken(VariableDeclarationParseVar)
        .addParseToken(FunctionDeclarationParse)
        .addParseToken(ObjectExpressionParse)
    p.runParse(ast.body)
    return ast
}