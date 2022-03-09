
import { Ast } from "../AstTypes/ast";
import { ParseContext, ParseTransform } from "../parse";
import { Token } from "../tokenizer";


const createMemberExpression = (token: Token, context: ParseContext) => {

}


export const MemberExpressionParse: ParseTransform = (token: Token, context: ParseContext) => {
    const asts:Array<Ast> = [];
    const tokeToken = context.getToken();
    const dotToken = tokeToken.next();
    const propertyToken = tokeToken.next();
    const eatTokens = context.eat(0,tokeToken.getIndex());
    console.log(eatTokens);
    // const memberExpression =  createMemberExpression(token, context);

    // return statement;
    return null;
}

