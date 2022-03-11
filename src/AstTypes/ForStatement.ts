import { Ast } from "./ast";

export class ForStatement extends Ast{
    type = "ForStatement";
    init:Ast;
    test:Ast;
    update:Ast;
    body:Ast;
    _generator() {
        return `for(${this.init._generator()}${this.test._generator()};${this.update._generator()})${this.body._generator()}`;
    }
}