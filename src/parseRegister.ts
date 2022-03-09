import { FunctionDeclarationParse } from "./Ast/functionDeclaration";
import { ObjectExpressionParse } from "./Ast/objectExpression";
import { ArrayExpressionParse } from "./Ast/arrayExpression";
import { VariableDeclarationParseConst, VariableDeclarationParseLet, VariableDeclarationParseVar } from "./Ast/variableDeclaration";
import { Ast } from "./AstTypes/ast";
import { Token } from "./tokenizer";
import { tokensTake } from "./tokensHelps";


export interface ParseContext {
    eat: (start: number, end: number) => Token[];
    getToken(): ReturnType<typeof tokensTake>;
    walk(current: Token): Ast;
    /* Excluded from this release type: runParse */
    runParse(ast: Array<Ast>): void;
    walkExpression(current: Token | Ast): Ast
}


export interface ParseTransform {
    (token: Token, context: ParseContext): Ast | null;
}

interface KeywordParse {
    kind: string;
    transform: ParseTransform;
}

const keyWordMap = new Map<string, KeywordParse>();

export const getKeyWordMap = () => {
    return keyWordMap;
}

export const hasRegisterKey = (key: string): boolean => {
    return keyWordMap.has(key);
}

const parseAdd = (t: KeywordParse) => {
    keyWordMap.set(t.kind, t);
}

export const parseInit = () => {
    //const
    parseAdd(VariableDeclarationParseConst)
    //let
    parseAdd(VariableDeclarationParseLet)
    //var
    parseAdd(VariableDeclarationParseVar)
    //普通function
    parseAdd(FunctionDeclarationParse)
    //字面量对象
    parseAdd(ObjectExpressionParse)
    //数组
    parseAdd(ArrayExpressionParse)
}