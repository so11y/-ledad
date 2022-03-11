import { composeParse } from "../parse";
import { ParseTransform } from "../parseRegister";
import { isSymbolToken } from "../tokensHelps";
import { ReturnStatement } from "../AstTypes/ReturnStatement";
import { createSimpleToken } from "./operatorAstCreate";



const genReturnStatementParse: ParseTransform = (token, context) => {
    const takeToken = context.getToken();
    const returnStatement = new ReturnStatement();
    takeToken.whereToken(v => !isSymbolToken(v, ";"));
    const eatRereturnToken = context.eat(0, takeToken.getIndex() - 1)
    if (eatRereturnToken.length === 1) {
        returnStatement.argument = createSimpleToken(eatRereturnToken[0]);
    } else if (eatRereturnToken.length) {
        returnStatement.argument = composeParse(eatRereturnToken).walk(eatRereturnToken.shift());
    }

    return returnStatement;
}


export const ReturnStatementParse = {
    kind: "return",
    transform: genReturnStatementParse
}