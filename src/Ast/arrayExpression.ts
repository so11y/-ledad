import { Ast } from "../AstTypes/ast";
import { Literal } from "../AstTypes/Literal";
import { ArrayExpression } from "../AstTypes/ArrayExpression";
import { composeParse } from "../parse";
import { hasRegisterKey, ParseTransform } from "../parseRegister";
import { Token } from "../tokenizer";
import { dotTakeSection, isSimpleToken, isSymbolToken, isSymbolTokens } from "../tokensHelps";
import { isExpression } from "../AstTypes/ExpressionStatement";


export const iterationArrayToken = (tokens: Array<Token>) => {
    const astProperties: Ast[] = [];
    const parse = composeParse(tokens);
    while (tokens.length) {
        const currentToken = tokens.shift();
        if (isSymbolToken(currentToken, ",")) {
            continue;
        }
        //是否简单类型
        //不能是符号
        const simpleAndNotKey = (isSimpleToken(currentToken) || !(hasRegisterKey(currentToken.value)))
        //没有在注册过关键字
        //不能是表达式
        const noSymbolTokenAndNotExpression = !isSymbolToken(currentToken) && !isExpression(currentToken, parse);
        if (simpleAndNotKey && noSymbolTokenAndNotExpression) {
            astProperties.push(new Literal(currentToken))
            //对象或者数组重新走递归流程
        } else {
            //到这里已经消耗掉了第一个开头的符号，并不是完整的
            //所以在这里在恢复回去,不是 关键字的时候
            if (isSymbolTokens(currentToken)) {
                tokens.unshift(currentToken);
            }
            const ast = parse.walk(currentToken);
            if (ast) {
                astProperties.push(ast)
            }
        }
    }
    return astProperties
}

export const createMultipleArrayExpression = (tokens: Array<Token>) => {
    //先消耗掉第一个[ 符号
    //到这里一定是双端对应符号
    //消耗第一个,不然回循环触发
    tokens.shift();
    return iterationArrayToken(tokens);
}

const createArrayExpression = (tokens: Array<Token>) => {
    const arrayAst = new ArrayExpression();
    arrayAst.elements = createMultipleArrayExpression(tokens);
    return arrayAst;
}


export const ArrayExpressionParse: ParseTransform = (token, context) => {
    //找最外一层的对象[]
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "[", endSymbol: "]" }, context.getToken())
    const eatToken = context.eat(startIndex, endIndex);
    return createArrayExpression(eatToken)
}
// export const ArrayExpressionParse = {
//     kind: "[",
//     transform: genArrayExpression
// }