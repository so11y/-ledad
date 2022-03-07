import { Ast } from "../AstTypes/ast";
import { Literal } from "../AstTypes/Literal";
import { ArrayExpression } from "../AstTypes/ArrayExpression";
import { composeParse, ParseTransform } from "../parse";
import { Token } from "../tokenizer";
import { dotTakeSection, isSimpleToken, isSymbolTokens } from "../tokensHelps";


const createMultipleArrayExpression = (tokens: Array<Token>) => {
    const astProperties: Ast[] = [];
    //先消耗掉第一个[ 符号
    tokens.shift();
    while (tokens.length) {
        const currentToken = tokens.shift();
        //是否简单类型
        if (isSimpleToken(currentToken)) {
            astProperties.push(new Literal(currentToken))
            //对象或者数组重新走递归流程
            //这里后面在改造支持函数类型
        } else {
            //到这里已经消耗掉了第一个开头的符号，并不是完整的
            //所以在这里在恢复回去,不是 关键字的时候
            if (isSymbolTokens( currentToken)) {
                tokens.unshift(currentToken);
            }
            const ast = composeParse(tokens).walk(currentToken);
            if (ast) {
                astProperties.push(ast)
            }
        }
    }
    return astProperties
}

const createArrayExpression = (tokens: Array<Token>) => {
    const arrayAst = new ArrayExpression();
    arrayAst.elements = createMultipleArrayExpression(tokens);
    return arrayAst;
}


const genArrayExpression: ParseTransform = (token, context) => {
    //找最外一层的对象[]
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "[", endSymbol: "]" }, context.getToken())
    const eatToken = context.eat(startIndex, endIndex);
    return createArrayExpression(eatToken)
}
export const ArrayExpressionParse = {
    kind: "[",
    transform: genArrayExpression
}