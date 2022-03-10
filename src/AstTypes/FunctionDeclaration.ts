import { Ast } from "./ast";
import { BlockStatement } from "./BlockStatement";
import { Identifier } from "./Identifier";
export class FunctionDeclaration extends Ast {
    type = "FunctionDeclaration";
    id: Identifier;
    generator: boolean = false;
    async: boolean = false;
    params: Array<Identifier> = [];
    body: BlockStatement;

    _generator() {
        const id = this.id ? " " + this.id._generator() : "";
        let body = '{}';
        if (this.body && this.body.body.length) {
            body = `{${this.body._generator()}}`;
        }
        return `function${id}(${this.params.map(v => v._generator()).join(",")})${body}`
    }
}