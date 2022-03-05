
export abstract class Ast {
    // start: number = 0;
    // end: number = 0;
    type: string = null;
}

export interface AstConstructor {
    new(): Ast;
}





