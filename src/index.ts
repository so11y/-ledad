import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let t = tokenizer(`let a = 15;
function good(a,b){

}
`);

let tokens = t();

console.log(tokens);
let parseContext = parse(tokens);

let ast = parseContext();

console.log(ast);

