import {Ast} from "./ast"

export class BlockStatement extends Ast {
    body: Array<Ast> = [];
    type = "BlockStatement";
}
