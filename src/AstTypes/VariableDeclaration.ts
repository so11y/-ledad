import { Ast } from "./ast";
import { Identifier } from "./Identifier";

export class VariableDeclarator extends Ast {
    type = "VariableDeclarator";
    id: Identifier;
    init: Ast;

    _generator(): string {
        return `${this.id._generator()} = ${this.init._generator()}`
    }
}

export class VariableDeclaration extends Ast {
    type = "VariableDeclaration";
    kind: string;
    declarations: Array<VariableDeclarator>;

    _generator() {
        return this.kind + " " + this.declarations.map(v => v._generator()).join(",") + ";";
    };
}
