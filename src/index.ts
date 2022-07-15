import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

let tokens = tokenizer(`
function good2(c){

}

`);
console.log(parse(tokens));
