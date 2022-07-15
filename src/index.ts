import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`
q.tostring(1,2,3)
`);
console.log(parse(tokens));

