import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let tokens = tokenizer(`
let good   = {a:1,b:3},c = 20;

`);

console.log(tokens);

let ast = parse(tokens);

console.log(ast);
// let ast = parseContext();

// console.log(ast);

