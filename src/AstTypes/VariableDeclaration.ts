import { Ast } from "./ast";
import { Identifier } from "./Identifier";

export class VariableDeclarator extends Ast {
    type = "VariableDeclarator";
    id: Identifier;
    init: Ast;
}

export class VariableDeclaration extends Ast {
    type = "VariableDeclaration";
    kind: string;
    declarations: Array<VariableDeclarator>
}
