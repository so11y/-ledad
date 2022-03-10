import { Ast } from "../AstTypes/ast";
import { CallExpression } from "../AstTypes/CallExpression";
import { MemberExpression } from "../AstTypes/MemberExpression";
import { NewExpression } from "../AstTypes/NewExpression";
import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";


//不能直接 new a; 代码设计问题

const createNewExpression = (ast: Ast) => {
    const newExpression = new NewExpression();
    if (ast instanceof CallExpression) {
        newExpression.callee = ast.callee;
        newExpression.arguments = ast.arguments;
    } else if (ast instanceof MemberExpression) {
        newExpression.callee = ast;
    }
    return newExpression;
}

export const NewExpressionParse = (context: ParseContext) => {
    const nextToken = context.eat(0, 1)[0];
    if (nextToken) {
        const express = context.walkExpression(nextToken);
        if (express) {
            return createNewExpression(express);
        }
    }

    throw new SyntaxError("new before need token");
}
