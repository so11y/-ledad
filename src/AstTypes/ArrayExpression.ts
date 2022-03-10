import { Ast } from "./ast"

export class ArrayExpression extends Ast {
    type = "ArrayExpression";
    elements: Array<Ast> = [];
    _generator() {
        return '['+ this.elements.map(v => v._generator()).join(",") + ']';
    }
}