import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";



let tokens = tokenizer(`

`);
console.log(parse(tokens));

