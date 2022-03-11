import { Ast } from "./ast";


export class UpdateExpression extends Ast {
    type = "UpdateExpression";
    operator: string;
    argument: Ast;
    _generator(): string | number {
        return this.argument._generator() + this.operator;
    }
}