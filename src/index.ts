import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let t = tokenizer(`let a = 10;`);
let tokens = t();

let parseContext = parse(tokens);

let ast = parseContext();

console.log(ast);
