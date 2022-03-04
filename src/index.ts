import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let tokens = tokenizer(`
let a = 10 , b = 20;
const aa = 110 , bb = 20;
`);

console.log(tokens);

let ast = parse(tokens);

console.log(ast);
// let ast = parseContext();

// console.log(ast);

