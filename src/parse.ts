
import { Token } from "./tokenizer";
import { Ast } from "./AstTypes/ast";
import { CallExpressionParse } from "./Ast/callExpression"
import { MemberExpressionParse } from "./Ast/memberExpression"
import { isToken, tokensTake } from "./tokensHelps";
import { ArrayExpressionParse } from "./Ast/arrayExpression";
import { ObjectExpressionParse } from "./Ast/objectExpression";
import { NewExpressionParse } from "./Ast/newExpression";
import { AssignmentExpressionParse } from "./Ast/assignmentExpression";
import { ExpressionStatement, ExpressionTypeEnum, isExpression } from "./AstTypes/ExpressionStatement";
import { getKeyWordMap, ParseContext, parseInit } from "./parseRegister"


/**
 * 引用吃掉
 */
export const composeParse = (tokens: Array<Token>): ParseContext => {
    const keyWordMap = getKeyWordMap();
    const parseContext = {
        eat: (start: number, end: number) => {
            return tokens.splice(start, end);
        },
        getToken() {
            return tokensTake(tokens);
        },
        //检查是否是语句
        walkExpression(current: Token | Ast) {
            const expressionType = isExpression(current, parseContext)
            switch (expressionType) {
                case ExpressionTypeEnum.NewExpression:
                    return NewExpressionParse(parseContext);
                case ExpressionTypeEnum.CallExpression:
                    return CallExpressionParse(current, parseContext);
                case ExpressionTypeEnum.MemberExpression:
                    if (isToken(current))
                        return MemberExpressionParse(current, parseContext);
                case ExpressionTypeEnum.ArrayExpression:
                    if (isToken(current))
                        return ArrayExpressionParse(current, parseContext);
                case ExpressionTypeEnum.ObjectExpression:
                    if (isToken(current))
                        return ObjectExpressionParse(current, parseContext);
                case ExpressionTypeEnum.AssignmentExpression:
                    return AssignmentExpressionParse(current, parseContext);
                default:
                    return null;
            }
        },
        walk(this: ParseContext, current: Token) {
            if (keyWordMap.has(current.value)) {
                return keyWordMap.get(current.value).transform(current, parseContext);
            }
            return this.walkExpression(current);
        },
        runParse(ast: Array<Ast>) {
            while (tokens.length) {
                const current = tokens.shift();
                const node = this.walk(current);
                if (node) {
                    if (ExpressionStatement.isExpressionType(node)) {
                        ast.push(new ExpressionStatement(node))
                    } else {
                        ast.push(node);
                    }
                }
            }
        },
    }
    return parseContext;
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

