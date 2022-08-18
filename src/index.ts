import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

const token =  tokenizer(`
export let a = 5;

`)

console.log(parse(token));

