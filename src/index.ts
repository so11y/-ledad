import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`
let a = {};

`);
console.log(parse(tokens));
