import {Ast} from "./ast";
import { BlockStatement } from "./BlockStatement";
import { Identifier } from "./Identifier";
export class FunctionDeclaration extends Ast {
    type = "FunctionDeclaration";
    id: Identifier;
    generator: boolean = false;
    async: boolean = false;
    params: Array<Identifier> = [];
    body: BlockStatement;

    initializeLoc(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}