import { Ast } from "./ast";

export class NewExpression extends Ast {
    type = "NewExpression";
    callee: Ast;
    arguments: Ast[] = [];

    _generator() {
        return 'new ' + this.callee._generator() + `(${this.arguments.map(v => v._generator()).join(",")})`;
    }
}