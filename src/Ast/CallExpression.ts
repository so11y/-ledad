
import { ParseContext, ParseTransform } from "../parse";
import { ExpressionStatement } from "../AstTypes/ExpressionStatement";
import { CallExpression } from "../AstTypes/CallExpression"
import { Token } from "../tokenizer";
import { dotTakeSection } from "../tokensHelps";
import { Identifier } from "../AstTypes/Identifier";
import { iterationArrayToken } from "./arrayExpression";

const createCallee = (tokens: Token) => {
    if (tokens) {
        return new Identifier(tokens);
    }
}

const createCallExpression = (token: Token, context: ParseContext) => {
    const callExpression = new CallExpression();
    const takeToken = context.getToken()
    callExpression.callee = createCallee(token);
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "(", endSymbol: ")" }, takeToken)
     //在这里不需要(符号了
    const eatArguments = context.eat(startIndex + 1, endIndex - 1);
    callExpression.arguments = iterationArrayToken(eatArguments);
    return callExpression;
}


export const CallExpressionParse: ParseTransform = (token: Token, context: ParseContext) => {
    // const statement = new ExpressionStatement();
    // statement.expression =
    return createCallExpression(token, context);;
}

