
export abstract class Ast {
    // start: number = 0;
    // end: number = 0;
    abstract type: string;
    static isAst(ast:any):ast is Ast{
        return ast instanceof Ast
    }
}

export interface AstConstructor {
    new(): Ast;
}





