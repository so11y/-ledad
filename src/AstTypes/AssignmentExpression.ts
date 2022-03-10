import { Ast } from "./ast";


export class AssignmentExpression extends Ast {
    type = "AssignmentExpression";
    left: Ast;
    right: Ast;
    _generator() {
        return this.left._generator() + " = " + this.right._generator();
    }
}