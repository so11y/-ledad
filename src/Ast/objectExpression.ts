
import { Token } from "../tokenizer";
import { dotTakeSection, isSimpleToken, isSymbolToken, tokensTake } from "../tokensHelps";
import { ObjectExpression, ObjectProperty } from "../AstTypes/ObjectExpression";
import { ParseTransform, TransformContext } from "../parse";
import { Identifier } from "../AstTypes/Identifier";
import { Literal } from "../AstTypes/Literal";

const createSimpleObjectProperty = (key: Token, value: Token) => {
    const identifier = new Identifier(key);
    const literal = new Literal(value);
    return new ObjectProperty(identifier, literal);
}

const createMultipleObjectExpression = (tokens: Array<Token>, context: TransformContext) => {
    const objProperties: ObjectProperty[] = [];
    // let stackToken: Array<Token> = [];
    while (tokens.length) {
        const afterToken = tokens.shift();
        const middleToken = tokens[0];
        if (middleToken && isSymbolToken(middleToken, ":")) {
            const beforeToken = tokens[1];
            //是否简单类型
            if (isSimpleToken(beforeToken)) {
                tokens.splice(0, 2);
                objProperties.push(createSimpleObjectProperty(afterToken, beforeToken))
            }
        }
    }
    return objProperties
}

const genObjectExpression: ParseTransform = (token, context) => {
    const objectAst = new ObjectExpression();
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "{", endSymbol: "}" }, context.getToken())
    const eatToken = context.eat(startIndex, endIndex);
    objectAst.properties = createMultipleObjectExpression(eatToken, context);
    return objectAst;
}
export const ObjectExpressionParse = {
    kind: "{",
    transform: genObjectExpression
}