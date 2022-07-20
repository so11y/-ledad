import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

//{aa as soso,qq as pp,a1 }
const token =  tokenizer("const a = '1'.to.go(1,2)")

console.log(parse(token));


`


`