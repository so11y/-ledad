import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`
let a = {;

`);
debugger
console.log(parse(tokens));
