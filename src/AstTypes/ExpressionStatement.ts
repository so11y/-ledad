import { ParseContext } from "src/parse";
import { Token } from "src/tokenizer";
import { Ast } from "./ast";

// export interface ExpressionType {
//     CallExpression: "CallExpression"
// }

// type IExpressionType<T, V extends keyof T = keyof T> = V extends V ? T[V] : never;
export enum ExpressionTypeEnum {
    CallExpression = "CallExpression"
}

// export const isExpression = (token: Token, context: ParseContext): IExpressionType<ExpressionType> => {
export const isExpression = (token: Token, context: ParseContext): ExpressionTypeEnum => {
    return ExpressionTypeEnum.CallExpression
}


export class ExpressionStatement extends Ast {
    type = "ExpressionStatement";
    expression: Ast;
}