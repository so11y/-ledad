import { Ast } from "./ast";

export class MemberExpression extends Ast {
    type = 'MemberExpression';
    object:Ast;
    property:Ast;
    // computed:boolean;
    // optional:boolean;
    _generator() {
        return `${this.object._generator()}.${this.property._generator()}`;
    }
}