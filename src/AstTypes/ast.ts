
export abstract class Ast {
    // start: number = 0;
    // end: number = 0;
    abstract type: string;
    static isAst(ast: any): ast is Ast {
        return ast instanceof Ast
    }

    //abstract generator():string | number;
    //先不强制實現
    // _generator(): string | number {
    //   throw new Error("Method not implemented.");
    //}
    abstract _generator(): string | number;
}

export interface AstConstructor {
    new(): Ast;
}


