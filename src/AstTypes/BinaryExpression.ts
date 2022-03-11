import { Ast } from "./ast";


export class BinaryExpression extends Ast {
    type = "AssignmentExpression";
    left: Ast;
    right: Ast;
    operator = "";
    _generator() {
        if(!this.operator){
            throw new SyntaxError("BinaryExpression miss operator")
        }
        return this.left._generator() +  ` ${this.operator} ` + this.right._generator();
    }
}