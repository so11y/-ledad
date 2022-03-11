import { Ast } from "./ast";
import { composeParse } from "../parse/parse";
import { ParseContext } from "../parse/parseContext";

export class VariableDeclarator extends Ast {
    type = "VariableDeclarator";
    id: Ast;
    init: Ast;
}

export class VariableDeclaration extends Ast {
    type = "VariableDeclaration";
    kind :string;
    declarations: Array<VariableDeclarator> = []
}

const VariableDeclaratorAnalyse  = (context: ParseContext)=>{

}


export const VariableDeclarationAnalyse = (context: ParseContext) => {
    const takeToken = context.getToken();
    const keyword = takeToken.eat(0, 1)[0];
    const variableDeclaration = new VariableDeclaration();
    variableDeclaration.kind = keyword.value;
    const asts = [];
    composeParse(takeToken.getRowTokens()).parse(asts);
    variableDeclaration.declarations = asts;
    return variableDeclaration;
}