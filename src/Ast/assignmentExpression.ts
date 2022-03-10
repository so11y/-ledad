import { Ast } from "../AstTypes/ast";
import { Identifier } from "../AstTypes/Identifier";
import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";
import { AssignmentExpression } from "../AstTypes/AssignmentExpression";
import { isSimpleToken, isSymbolToken, isToken } from "../tokensHelps";
import { Literal } from "../AstTypes/Literal";


const createSimpleToken = (token: Token | Ast) => {
    if (isToken(token)) {
        if (isSimpleToken(token)) {
            return new Literal(token)
        } else {
            return new Identifier(token)
        }
    }
    return token;
}

const createCallExpression = (token: Token | Ast) => {
    const assignmentExpression = new AssignmentExpression();
    assignmentExpression.left = createSimpleToken(token);
    return assignmentExpression;
}


export const AssignmentExpressionParse = (token: Token | Ast, context: ParseContext) => {
    const takeToken = context.getToken();
    //把等号给吃掉
    context.eat(0, 1)
    const nextToken = takeToken.next();
    const assignmentExpression = createCallExpression(token);
    if (nextToken) {
        const express = context.walk(nextToken);
        if (express) {
            assignmentExpression.right = express;
        } else {
            if (!isSymbolToken(nextToken)) {
                assignmentExpression.right = createSimpleToken(nextToken);
            } else {
                throw new SyntaxError(" Assignment miss right");
            }
        }
    }
    return assignmentExpression;
}
