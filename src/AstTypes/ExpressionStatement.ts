import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";
import { isSymbolToken, isNameToken, isToken } from "../tokensHelps";
import { ArrayExpression } from "./ArrayExpression";
import { Ast } from "./ast";
import { CallExpression } from "./CallExpression";
import { MemberExpression } from "./MemberExpression";
import { NewExpression } from "./NewExpression";
import { ObjectExpression } from "./ObjectExpression";
import { AssignmentExpression } from "./AssignmentExpression";
import { SequenceExpression } from "./SequenceExpression";
import { BinaryExpression } from "./BinaryExpression";

// export interface ExpressionType {
//     CallExpression: "CallExpression"
// }

// type IExpressionType<T, V extends keyof T = keyof T> = V extends V ? T[V] : never;
export enum ExpressionTypeEnum {
    CallExpression = "CallExpression",
    MemberExpression = "MemberExpression",
    ArrayExpression = "ArrayExpression",
    ObjectExpression = "ObjectExpression",
    AssignmentExpression = "AssignmentExpression",
    NewExpression = "NewExpression",
    BinaryExpression = "BinaryExpression"
}

// export const isExpression = (token: Token, context: ParseContext): IExpressionType<ExpressionType> => {
export const isExpression = (token: Token | Ast, context: ParseContext): ExpressionTypeEnum => {
    const takeToken = context.getToken();
    const isBrackets = takeToken.next();
    if (token) {
        const nextToken = takeToken.next();
        if (isToken(token) && isSymbolToken(token, "[")) {
            return ExpressionTypeEnum.ArrayExpression;
        } else if (isToken(token) && isSymbolToken(token, "{")) {
            return ExpressionTypeEnum.ObjectExpression;
        } else if (isBrackets) {
            if (isSymbolToken(isBrackets, "=")) {
                if (nextToken) {
                    switch (isBrackets.value) {
                        case "=":
                            return ExpressionTypeEnum.AssignmentExpression;
                    }
                }
            } else if (["+", "-", "*", "/"].some(v => isSymbolToken(isBrackets, v))) {
                return ExpressionTypeEnum.BinaryExpression;
            } else if (isToken(token) && isNameToken(token) && token.value === "new" && !isSymbolToken(isBrackets)) {
                return ExpressionTypeEnum.NewExpression;
            } else if (isToken(token) && isNameToken(token) && isSymbolToken(isBrackets, ".")) {
                if (nextToken && !isNameToken(nextToken)) {
                    throw new SyntaxError(`Unexpected token ${nextToken.value}`);
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
            NewExpression,
            AssignmentExpression,
            SequenceExpression,
            BinaryExpression
        ]
        return expressions.some(v => ast instanceof v)
    }
    _generator() {
        return this.expression._generator() + ";";
    }
}