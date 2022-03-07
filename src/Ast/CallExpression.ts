
import { composeParse, ParseContext, ParseTransform } from "../parse";
import { ExpressionStatement } from "../AstTypes/ExpressionStatement";
import { Token } from "src/tokenizer";



export const CallExpressionParse:ParseTransform = (token: Token, context: ParseContext) => {
    const statement = new ExpressionStatement();

    return statement;
}

