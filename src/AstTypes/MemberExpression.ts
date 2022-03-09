import { Ast } from "./ast";


export class MemberExpression extends Ast {
    object:Ast;
    property:Ast;
    // computed:boolean;
    // optional:boolean;
}