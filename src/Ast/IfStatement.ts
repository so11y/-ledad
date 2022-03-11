import { composeParse } from "../parse";
import { ParseTransform } from "../parseRegister";
import { dotTakeSection } from "../tokensHelps";
import { BlockStatement } from "../AstTypes/BlockStatement";
import { IfStatement } from "../AstTypes/IfStatement";


const genIfStatementParse: ParseTransform = (token, context) => {
    const ifStatement = new IfStatement();
    const blockStatement = new BlockStatement();
    ifStatement.consequent = blockStatement;
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
    ifStatement.test = genAst[0].expression;
    composeParse(bodyTokens).runParse(blockStatement.body);
    return ifStatement;

}


export const IfStatementParse = {
    kind: "if",
    transform: genIfStatementParse
}