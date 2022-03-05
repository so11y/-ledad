
import { Token } from "../tokenizer";
import { dotTakeSection, isSimpleToken, isSymbolToken, tokensTake } from "../tokensHelps";
import { ObjectExpression, ObjectProperty } from "../AstTypes/ObjectExpression";
import { ParseTransform, TransformContext } from "../parse";
import { Identifier } from "../AstTypes/Identifier";
import { Literal } from "../AstTypes/Literal";
import { Ast } from "../AstTypes/ast";

const createSimpleObjectProperty = (key: Token, value: Token) => {
    const identifier = new Identifier(key);
    const literal = new Literal(value);
    return new ObjectProperty(identifier, literal);
}
const createObjectProperty = (key: Token, value: Ast) => {
    const identifier = new Identifier(key);
    return new ObjectProperty(identifier, value);
}


const createMultipleObjectExpression = (tokens: Array<Token>, context: TransformContext) => {
    const objProperties: ObjectProperty[] = [];
    while (tokens.length) {
        const afterToken = tokens.shift();
        const middleToken = tokens[0];
        if (middleToken && isSymbolToken(middleToken, ":")) {
            const beforeToken = tokens[1];
            //是否简单类型
            if (isSimpleToken(beforeToken)) {
                tokens.splice(0, 2);
                objProperties.push(createSimpleObjectProperty(afterToken, beforeToken))
            } else if (isSymbolToken(beforeToken, "{")) {
                const takeTokens = tokensTake([beforeToken, ...tokens]);
                const [startIndex, endIndex] = dotTakeSection({ startSymbol: "{", endSymbol: "}" }, takeTokens)
                const eatTokens = tokens.splice(startIndex, endIndex);
                const objAst = createObjectExpression(eatTokens,context);
                objProperties.push(createObjectProperty(afterToken,objAst))
            }
        }
    }
    return objProperties
}
const createObjectExpression = (tokens: Array<Token>, context: TransformContext) =>{
  const objectAst = new ObjectExpression();
  objectAst.properties = createMultipleObjectExpression(tokens, context);
  return objectAst;
}

const genObjectExpression: ParseTransform = (token, context) => {
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "{", endSymbol: "}" }, context.getToken())
    const eatToken = context.eat(startIndex, endIndex);
    return createObjectExpression(eatToken,context)
}
export const ObjectExpressionParse = {
    kind: "{",
    transform: genObjectExpression
}