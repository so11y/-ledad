import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`

good.map(function (value){});
`);
console.log(parse(tokens));
