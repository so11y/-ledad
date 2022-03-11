import { composeParse } from "../parse";
import { ForStatement } from "../AstTypes/ForStatement";
import { ParseTransform } from "../parseRegister";
import { dotTakeSection } from "../tokensHelps";
import { BlockStatement } from "../AstTypes/BlockStatement";


const genForStatementParse: ParseTransform = (token, context) => {
    const forStatement = new ForStatement();
    const blockStatement = new BlockStatement();
    forStatement.body = blockStatement;
    blockStatement.body = [];
    const takeToken = context.getToken()
    const [startIndex, endIndex] = dotTakeSection({ startSymbol: "(", endSymbol: ")" }, takeToken);
    const eatArguments = context.eat(startIndex , endIndex );
    //丢弃两端的括号
    eatArguments.shift();
    eatArguments.pop();
    takeToken.init();
    const [bodyStart, bodyEndIndex] = dotTakeSection({ startSymbol: "{", endSymbol: "}" }, takeToken)
    const bodyTokens = context.eat(bodyStart, bodyEndIndex);
     //丢弃两端的括号
    bodyTokens.shift();
    bodyTokens.pop();
    const genAst = []
    composeParse(eatArguments).runParse(genAst);
    forStatement.init = genAst[0];
    forStatement.test = genAst[1].expression;
    forStatement.update = genAst[2].expression;
    composeParse(bodyTokens).runParse(blockStatement.body);
    return forStatement;

}


export const ForStatementParse = {
    kind: "for",
    transform: genForStatementParse
}