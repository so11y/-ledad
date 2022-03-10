import { Ast } from "./ast";


export class AssignmentExpression extends Ast {
    type = "AssignmentExpression";
    left: Ast;
    right: Ast;
}