
import { ParseContext } from "../parseRegister";
import { CallExpression } from "../AstTypes/CallExpression"
import { Token } from "../tokenizer";
import { dotTakeSection, isToken } from "../tokensHelps";
import { Identifier } from "../AstTypes/Identifier";
import { iterationArrayToken } from "./arrayExpression";
import { Ast } from "src/AstTypes/ast";

const createCallee = (token: Token | Ast):Ast => {
    if (token && isToken(token)) {
        return new Identifier(token);
    }
    return token as Ast;
}

const createCallExpression = (token: Token | Ast, context: ParseContext) => {
    const callExpression = new CallExpression();
    const takeToken = context.getToken()
    callExpression.callee = createCallee(token);
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "(", endSymbol: ")" }, takeToken)
     //在这里不需要(符号了
    const eatArguments = context.eat(startIndex + 1, endIndex - 1);
    callExpression.arguments = iterationArrayToken(eatArguments);
    return callExpression;
}


export const CallExpressionParse = (token: Token | Ast, context: ParseContext) => {
    return createCallExpression(token, context);;
}

