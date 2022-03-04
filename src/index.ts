import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let tokens = tokenizer(`let a = { a : 1 ,b:'2'};`);

console.log(tokens);

// let tokens = t();

// console.log(tokens);
// let parseContext = parse(tokens);

// let ast = parseContext();

// console.log(ast);

