import { Ast } from "./ast";
import { Token } from "../tokenizer";
import { ParseContext } from "../parseRegister";
import { NewExpression } from "./NewExpression";
import { CallExpression } from "./CallExpression";
import { ArrayExpression } from "./ArrayExpression";
import { MemberExpression } from "./MemberExpression";
import { ObjectExpression } from "./ObjectExpression";
import { BinaryExpression } from "./BinaryExpression";
import { UpdateExpression } from "./UpdateExpression";
import { SequenceExpression } from "./SequenceExpression";
import { AssignmentExpression } from "./AssignmentExpression";
import { isSymbolToken, isNameToken, isToken } from "../tokensHelps";

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
    BinaryExpression = "BinaryExpression",
    UpdateExpression = "UpdateExpression"
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
            //运算符++ , --
            if (nextToken && ["+", "-"].some(v => isSymbolToken(isBrackets, v) && isSymbolToken(nextToken, v))) {
                return ExpressionTypeEnum.UpdateExpression;
                //等号赋值不是let var const的情况下
            } else if (isSymbolToken(isBrackets, "=")) {
                if (nextToken) {
                    return ExpressionTypeEnum.AssignmentExpression;
                }
                //运算符加减乘除
            } else if (["+", "-", "*", "/"].some(v => isSymbolToken(isBrackets, v))) {
                if (nextToken) {
                    return ExpressionTypeEnum.BinaryExpression;
                }
                //new 关键字
            } else if (isToken(token) && isNameToken(token) && token.value === "new" && !isSymbolToken(isBrackets)) {
                return ExpressionTypeEnum.NewExpression;
                //对象 '点' 属性
            } else if (isToken(token) && isNameToken(token) && isSymbolToken(isBrackets, ".")) {
                if (nextToken && !isNameToken(nextToken)) {
                    throw new SyntaxError(`Unexpected token ${nextToken.value}`);
                }
                return ExpressionTypeEnum.MemberExpression;
                //函数调用
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
            BinaryExpression,
            UpdateExpression
        ]
        return expressions.some(v => ast instanceof v)
    }
    _generator() {
        return this.expression._generator() + ";";
    }
}