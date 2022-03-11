import { composeParse } from "../parse";
import { BlockStatement } from "../AstTypes/BlockStatement";
import { FunctionDeclaration } from "../AstTypes/FunctionDeclaration";
import { Identifier } from "../AstTypes/Identifier";
import { ParseTransform } from "../parseRegister";
import { dotTakeSection, getTokenTypes, isSymbolToken, TokenParseError, TokenParseErrors } from "../tokensHelps";


const genFunctionDeclaration: ParseTransform = (token, context) => {
    const funAst = new FunctionDeclaration();
    const identifier = new Identifier()
    const blockStatement = new BlockStatement();
    funAst.id = identifier;
    funAst.body = blockStatement;
    blockStatement.body = [];
    const t = context.getToken();
    const isVariable = t.next();
    if (!isSymbolToken(isVariable, "(")) {
        if (isVariable.type !== "name") {
            throw new SyntaxError('function space before need token type is variable');
        }
        identifier.initialize(isVariable)
        //吃掉之前使用过的token
        context.eat(0, t.getIndex());
    } else {
        funAst.id = null;
    }
    //重新恢复指针
    t.init();
    try {
        //获取( )之间的tokens
        const [startIndex, endIndex] = dotTakeSection({ startSymbol: "(", endSymbol: ")" }, t)
        const endTokens = context.eat(startIndex, endIndex);
        //重新恢复指针
        t.init();
        const paramsTokens = getTokenTypes(endTokens, "name");
        //创建params ast
        funAst.params = paramsTokens.map(v => new Identifier(v));
        const [bodyStart, bodyEndIndex] = dotTakeSection({ startSymbol: "{", endSymbol: "}" }, t)
        const bodyTokens = context.eat(bodyStart, bodyEndIndex);
        //丢弃两端的括号
        bodyTokens.shift();
        bodyTokens.pop();
        composeParse(bodyTokens).runParse(blockStatement.body);
    } catch (e) {
        if (e instanceof TokenParseError) {
            if (e.errorCode === TokenParseErrors.startNotFind)
                throw new SyntaxError("Unexpected token (")
            if (e.errorCode === TokenParseErrors.endNotFind)
                throw new SyntaxError("Unexpected token end ) not find")
        }
    }

    return funAst;
}


export const FunctionDeclarationParse = {
    kind: "function",
    transform: genFunctionDeclaration
}