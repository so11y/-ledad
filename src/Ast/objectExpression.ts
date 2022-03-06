
import { Token } from "../tokenizer";
import { dotTakeSection, isFunctionToken, isSimpleToken, isSymbolToken, parseCanWalk } from "../tokensHelps";
import { ObjectExpression, ObjectProperty } from "../AstTypes/ObjectExpression";
import { composeParse, ParseTransform } from "../parse";
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


const createMultipleObjectExpression = (tokens: Array<Token>) => {
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
                //对象或者数组重新走递归流程
            } else if (parseCanWalk(beforeToken)) {
                //吃掉当前的 ':' 符号 下一个是{ 开始递归找最外面一层的 {} 对象
                tokens.splice(0, 1);
                if(isFunctionToken(beforeToken)){
                    //如果是function关键字 需要把关键字吃掉
                    tokens.shift();
                }
                //在这里进行递归的时候
                //把当前循环的tokens給吃掉
                const objAst = composeParse(tokens).walk(beforeToken);
                objProperties.push(createObjectProperty(afterToken, objAst))
            }
        }
    }
    return objProperties
}

const createObjectExpression = (tokens: Array<Token>) => {
    const objectAst = new ObjectExpression();
    objectAst.properties = createMultipleObjectExpression(tokens);
    return objectAst;
}

const genObjectExpression: ParseTransform = (token, context) => {
    //找最外一层的对象{}
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "{", endSymbol: "}" }, context.getToken())
    const eatToken = context.eat(startIndex, endIndex);
    return createObjectExpression(eatToken)
}
export const ObjectExpressionParse = {
    kind: "{",
    transform: genObjectExpression
}