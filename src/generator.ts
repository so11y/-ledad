import {Ast} from "./AstTypes/ast";


export const generator = (ast:Ast | Ast[],):string=>{
    if(!Array.isArray(ast)){
        return ast._generator() as string;
    }
    return  ast.map(v=>v._generator()).join("\n");
}