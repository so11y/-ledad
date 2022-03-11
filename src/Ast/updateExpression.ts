
import { Identifier } from "../AstTypes/Identifier";
import { isToken } from "../tokensHelps";
import { Ast } from "../AstTypes/ast";
import { UpdateExpression } from "../AstTypes/UpdateExpression";
import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";



export const UpdateExpressionParse = (token: Token | Ast, context: ParseContext) => {
    const updateSymbol = context.eat(0, 2).map(v=>v.value).join("");
    const updateExpression = new UpdateExpression();
    updateExpression.operator = updateSymbol;
    if (isToken(token)) {
        updateExpression.argument = new Identifier(token);
    }else{
        updateExpression.argument = token;
    }
    return updateExpression;
}

