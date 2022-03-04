import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let tokens = tokenizer(`let a = { a : 1 ,b:'2'};`);

console.log(tokens);

let ast = parse(tokens);

console.log(ast);
// let ast = parseContext();

// console.log(ast);

