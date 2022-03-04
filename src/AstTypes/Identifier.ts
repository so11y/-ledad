import { Token } from "../tokenizer";
import {Ast} from "./ast"

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
        this.start = t.start;
        this.end = t.end;
        this.name = t.value;
    }
}
