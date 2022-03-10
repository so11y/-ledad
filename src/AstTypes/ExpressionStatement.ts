import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";
import { isSymbolToken, isNameToken, isToken, isSimpleToken } from "../tokensHelps";
import { ArrayExpression } from "./ArrayExpression";
import { Ast } from "./ast";
import { CallExpression } from "./CallExpression";
import { MemberExpression } from "./MemberExpression";
import { ObjectExpression } from "./ObjectExpression";
import { AssignmentExpression } from "./AssignmentExpression";

// export interface ExpressionType {
//     CallExpression: "CallExpression"
// }

// type IExpressionType<T, V extends keyof T = keyof T> = V extends V ? T[V] : never;
export enum ExpressionTypeEnum {
    CallExpression = "CallExpression",
    MemberExpression = "MemberExpression",
    ArrayExpression = "ArrayExpression",
    ObjectExpression = "ObjectExpression",
    AssignmentExpression = "AssignmentExpression"
}

// export const isExpression = (token: Token, context: ParseContext): IExpressionType<ExpressionType> => {
export const isExpression = (token: Token | Ast, context: ParseContext): ExpressionTypeEnum => {
    const takeToken = context.getToken();
    const isBrackets = takeToken.next();
    if (token) {
        if (isToken(token) && isSymbolToken(token, "[")) {
            return ExpressionTypeEnum.ArrayExpression;
        } else if (isToken(token) && isSymbolToken(token, "{")) {
            return ExpressionTypeEnum.ObjectExpression;
        } else if (Ast.isAst(token) && isSymbolToken(isBrackets,"=")){
            return ExpressionTypeEnum.AssignmentExpression;
        } else if (isBrackets) {
            if (isToken(token) && isNameToken(token) && isSymbolToken(isBrackets, ".")) {
                const nextPropertyToken = takeToken.next();
                if (!isNameToken(nextPropertyToken)) {
                    throw new SyntaxError(`Unexpected token ${nextPropertyToken.value}`);
                }
                return ExpressionTypeEnum.MemberExpression;
            } else if ((Ast.isAst(token) || isNameToken(token)) && isSymbolToken(isBrackets, "(")) {
                return ExpressionTypeEnum.CallExpression
            }
        }
    }
    return null;
}
export class ExpressionStatement extends Ast {
    type = "ExpressionStatement";
    expression: Ast;
    constructor(expression?: Ast) {
        super();
        if (expression) {
            this.expression = expression;
        }
    }

    static isExpressionType(ast: Ast): boolean {
        const expressions = [
            ArrayExpression,
            MemberExpression,
            CallExpression,
            ObjectExpression,
            AssignmentExpression
        ]
        return expressions.some(v => ast instanceof v)
    }
}