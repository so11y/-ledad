
import { Token } from "./tokenizer";
import { Ast } from "./AstTypes/ast";
import { FunctionDeclarationParse } from "./Ast/functionDeclaration";
import { ObjectExpressionParse } from "./Ast/objectExpression";
import { ArrayExpressionParse } from "./Ast/arrayExpression";
import { CallExpressionParse } from "./Ast/callExpression"
import { MemberExpressionParse } from "./Ast/memberExpression"
import { VariableDeclarationParseConst, VariableDeclarationParseLet, VariableDeclarationParseVar } from "./Ast/variableDeclaration";
import { tokensTake } from "./tokensHelps";
import { ExpressionTypeEnum, isExpression } from "./AstTypes/ExpressionStatement";


export interface ParseContext {
    eat: (start: number, end: number) => Token[];
    getToken(): ReturnType<typeof tokensTake>;
    walk(current: Token): Ast;
    runParse(ast: Array<Ast>): void;
}


export interface ParseTransform {
    (token: Token, context: ParseContext): Ast | null;
}

interface KeywordParse {
    kind: string;
    transform: ParseTransform;
}
const keyWordMap = new Map<string, KeywordParse>();

/**
 * 引用吃掉
 */
export const composeParse = (tokens: Array<Token>): ParseContext => {

    const parseContext = {
        eat: (start: number, end: number) => {
            return tokens.splice(start, end);
        },
        getToken() {
            return tokensTake(tokens);
        },
        walk(current: Token) {
            if (keyWordMap.has(current.value)) {
                return keyWordMap.get(current.value).transform(current, parseContext);
            }
            console.log("---");
            //检查是否是语句
            const expressionType = isExpression(current, parseContext)
            switch (expressionType) {
                case ExpressionTypeEnum.CallExpression:
                    return CallExpressionParse(current, parseContext);
                case ExpressionTypeEnum.MemberExpression:
                    return MemberExpressionParse(current, parseContext);
                default:
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
        },
    }
    return parseContext;
}

const parseAdd = (t: KeywordParse) => {
    keyWordMap.set(t.kind, t);
}

const parseInit = () => {
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

export const parse = (tokens: Array<Token>) => {
    const ast = {
        type: "Program",
        body: [] as Ast[],
    }
    parseInit();
    composeParse(tokens).runParse(ast.body)
    return ast
}