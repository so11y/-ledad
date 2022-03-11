import { Ast } from "./ast";

export class IfStatement extends Ast{
    type = "IfStatement";
    test:Ast;
    consequent:Ast;
    _generator() {
        return `if(${this.test._generator()})${this.consequent._generator()}`;
    }
}