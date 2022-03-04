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
        this.start = t.start;
        this.end = t.end;
        if (t.type === "number") {
            this.value = Number(t.value);
            return;
        }
        this.value = t.value;
    }
}

