import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`
a.tostring().c.toString(1,2,3)
`);
console.log(parse(tokens));
