import { Ast } from "./ast";

export class ReturnStatement extends Ast {
    type = "ReturnStatement";
    argument: Ast;
    _generator() {
        return `\n return ${this.argument ? this.argument._generator():''};`;
    }
}