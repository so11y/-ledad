import { Ast } from "./ast";

export class NewExpression extends Ast {
    type  = "NewExpression";
    callee:Ast;
    arguments:Ast[] = [];
}