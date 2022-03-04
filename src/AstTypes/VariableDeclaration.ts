import { Ast } from "./ast";
import { Identifier } from "./Identifier";

export class VariableDeclarator {
    type = "VariableDeclarator";
    start: number;
    end: number;
    id: Identifier;
    init: Ast;


    initSequence(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}

export class VariableDeclaration extends Ast {
    type = "VariableDeclaration";
    kind: string;
    declarations: Array<VariableDeclarator>
}
