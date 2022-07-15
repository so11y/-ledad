import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`
let a = 1;
let a = 2;

`);
console.log(parse(tokens));
