
import { Token } from "../tokenizer";
import { dotTakeSection, isSimpleToken, isSymbolToken, isSymbolTokens } from "../tokensHelps";
import { ObjectExpression, ObjectProperty } from "../AstTypes/ObjectExpression";
import { composeParse } from "../parse";
import { hasRegisterKey, ParseTransform } from "../parseRegister";
import { Identifier } from "../AstTypes/Identifier";
import { Literal } from "../AstTypes/Literal";
import { Ast } from "../AstTypes/ast";
import { isExpression } from "../AstTypes/ExpressionStatement";

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
            const nextMaybeExpressionToKen = tokens[2];
            if (isSymbolToken(beforeToken, ",")) {
                continue;
            }
            //是否简单类型
            //没有在注册过关键字
            const simpleAndNotKey = (isSimpleToken(beforeToken) || !(hasRegisterKey(beforeToken.value)))
            //不能是符号,下一项不能是 '.' 符号
            const noSymbolTokenAndNotExpression = !isSymbolToken(beforeToken) && (!nextMaybeExpressionToKen || !isSymbolToken(nextMaybeExpressionToKen,"."))
            if (simpleAndNotKey && noSymbolTokenAndNotExpression) {
                // if (isSimpleToken(beforeToken)) {

                tokens.splice(0, 2);
                objProperties.push(createSimpleObjectProperty(afterToken, beforeToken))
                //其他类型重新走递归流程
            } else {
                //吃掉当前的 ':' 符号 下一个是{ 开始递归找最外面一层的 {} 对象
                tokens.splice(0, 1);
                if (!isSymbolTokens(beforeToken)) {
                    //如果是关键字 需要把关键字吃掉
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

export const ObjectExpressionParse: ParseTransform = (token, context) => {
    //找最外一层的对象{}
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "{", endSymbol: "}" }, context.getToken())
    const eatToken = context.eat(startIndex, endIndex);
    return createObjectExpression(eatToken)
}