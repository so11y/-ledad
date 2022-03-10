import {Ast} from "./AstTypes/ast";


export const generator = (ast:Ast | Ast[],)=>{
    if(!Array.isArray(ast)){
        return ast._generator();
    }
    return  ast.map(v=>v._generator()).join("\n");
}