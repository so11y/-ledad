import { Ast } from "../AstTypes/ast";
import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";
import { createSimpleToken, operatorAstCreate } from "./operatorAstCreate";
import { BinaryExpression } from "../AstTypes/BinaryExpression";


const createBinaryExpression = (token: Token | Ast) => {
    const assignmentExpression = new BinaryExpression();
    assignmentExpression.left = createSimpleToken(token);
    return assignmentExpression;
}

export const BinaryExpressionParse = (token: Token | Ast, context: ParseContext) => {
    return operatorAstCreate(token, context, createBinaryExpression);
}
