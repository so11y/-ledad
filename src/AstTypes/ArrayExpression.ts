import { Ast } from "./ast"

export class ArrayExpression extends Ast {
    type = "ArrayExpression";
    elements: Array<Ast> = [];
}