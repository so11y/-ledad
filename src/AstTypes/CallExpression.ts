
import { Ast } from "./ast";


export class CallExpression extends Ast {
    type = "CallExpression";
    callee: Ast;
    arguments: Ast[];

    _generator() {
        return this.callee._generator() + `(${this.arguments.map(v => v._generator()).join(",")})`;
    }
}
