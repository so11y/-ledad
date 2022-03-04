import { FunctionDeclaration } from "./ast";
import { ParseTransform } from "./parse";


const genFunctionDeclaration: ParseTransform = (token, context) => {
    const funAst  = new FunctionDeclaration();


    return funAst;
}


export const FunctionDeclarationParse = {
    kind: "function",
    transform: genFunctionDeclaration
}