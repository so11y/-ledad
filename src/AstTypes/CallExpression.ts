
import { Ast } from "./ast";


export class CallExpression extends Ast{
    type="CallExpression";
    callee:Ast;
    arguments:Ast[];
}
