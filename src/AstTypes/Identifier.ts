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
            throw new SyntaxError('identifier type need name');
        }
        this.name = t.value;
    }

    _generator(): string {
        return this.name;
    }
}
