import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`
await await 5;
`);

console.log(parse(tokens));
