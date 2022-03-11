import { Ast } from "../AstTypes/ast";
import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";
import { AssignmentExpression } from "../AstTypes/AssignmentExpression";
import { createSimpleToken, operatorAstCreate } from "./operatorAstCreate";


const createAssignmentExpression = (token: Token | Ast) => {
    const assignmentExpression = new AssignmentExpression();
    assignmentExpression.left = createSimpleToken(token);
    return assignmentExpression;
}

export const AssignmentExpressionParse = (token: Token | Ast, context: ParseContext) => {
    console.log(token,"-----");
    return operatorAstCreate(token, context, createAssignmentExpression);
}
