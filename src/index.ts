import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let tokens = tokenizer(`
let cc = 10;
let good   = {a : '1' , b : { c : 2 , g : 2020 }};

`);

console.log(tokens);

let ast = parse(tokens);

console.log(ast);
// let ast = parseContext();

// console.log(ast);

