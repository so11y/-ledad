import { Token } from "../tokenizer";
import { Ast } from "./ast";

export class Literal extends Ast {
    type = "Literal";
    value: string | number;

    constructor(t?: Token) {
        super();
        if (t) {
            this.initialize(t);
        }
    }
    initialize(t: Token) {
        if (t.type === "number") {
            this.value = Number(t.value);
            return;
        }
        this.value = t.value;
    }
    _generator() {
        return this.value;
    }
}

