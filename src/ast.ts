import { Token } from "./tokenizer";

export abstract class Ast {
    start: number = 0;
    end: number = 0;
    type: string = null;
}

export interface AstConstructor {
    new(): Ast;
}

export class Identifier extends Ast {
    type = "Identifier";
    name: string;

    constructor(t?: Token) {
        super();
        if (t) {
            this.initialize(t);
        }
    }
    initialize(t: Token) {
        this.start = t.start;
        this.end = t.end;
        this.name = t.value;
    }
}

export class Literal extends Ast  {
    type = "Literal";
    value: string | number;

    constructor(t?: Token) {
        super();
        if (t) {
            this.initialize(t);
        }
    }
    initialize(t: Token) {
        this.start = t.start;
        this.end = t.end;
        this.value = t.value;
    }
}

export class BlockStatement extends Ast {
    body: Array<Ast> = [];
    type = "BlockStatement";
}

export class FunctionDeclaration extends Ast {
    type = "FunctionDeclaration";
    id: Identifier;
    generator: boolean = false;
    async: boolean = false;
    params: Array<Identifier> = [];
    body: BlockStatement;

    initializeLoc(start:number,end:number){
        this.start = start;
        this.end = end;
    }
}

export class VariableDeclarator {
    type = "VariableDeclarator";
    start: number;
    end: number;
    id: Identifier;
    init: Literal;


    initSequence(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}
export class VariableDeclaration extends Ast {
    type = "VariableDeclaration";
    kind: string;
    declarations: Array<VariableDeclarator>
}
