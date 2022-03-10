import { Ast } from "./ast";


export class SequenceExpression extends Ast {
    type = "SequenceExpression";
    expressions: Ast[] = [];
    _generator() {
        return this.expressions.map(v => v._generator()).join(",");
    }
}