import { Token } from "../tokenizer";
import { Ast } from "./ast"

export class Identifier extends Ast {
    type = "Identifier";
    name: string;

    constructor(t?: Token) {
        super();
        if (t) {
            this.initialize(t);
        }
    }
    initialize(t: Token) {
        if (t.type !== "name") {
            throw new SyntaxError('identifier SyntaxError error');
        }
        this.name = t.value;
    }
}
