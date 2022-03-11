import { Ast } from "./ast"
export class BlockStatement extends Ast {
    body: Array<Ast> = [];
    type = "BlockStatement";

    _generator(): string | number {
        return '{' + this.body.map(v => v._generator()).join("") + '}';
    }
}
