
import { ParseContext, ParseTransform } from "../parse";
import { ExpressionStatement } from "../AstTypes/ExpressionStatement";
import { CallExpression } from "../AstTypes/CallExpression"
import { Token } from "../tokenizer";
import { dotTakeSection } from "../tokensHelps";
import { Identifier } from "../AstTypes/Identifier";
import { iterationArrayToken } from "./arrayExpression";

const createCallee = (tokens: Array<Token>) => {
    if (tokens.length === 1) {
        return new Identifier(tokens[0]);
    }
}

const createCallExpression = (token:Token, context: ParseContext) => {
    const callExpression = new CallExpression();
    const takeToken = context.getToken()

    // //找到( 之前的
    // takeToken.whereToken((isSymbol) => isSymbol.value != "(");
    // // 在where中指针消耗到了 '(' 符号重新在指回 name 类型token
    // takeToken.prev(2)
    // // 吃掉之前的
    // const eatCallee = context.eat(0, takeToken.getIndex());
    // // 吃掉之后重新恢复指针
    // callExpression.callee = createCallee(eatCallee);
    // takeToken.init();
    callExpression.callee = createCallee([token]);
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "(", endSymbol: ")" }, takeToken)

    const eatArguments = context.eat(startIndex+1, endIndex-1);
    //在这里不需要(符号了
    // eatArguments.shift();
    // eatArguments.pop();
    callExpression.arguments = iterationArrayToken(eatArguments);
    return callExpression;
}


export const CallExpressionParse: ParseTransform = (token: Token, context: ParseContext) => {
    const statement = new ExpressionStatement();

    statement.expression = createCallExpression(token, context);
    return statement;
}

