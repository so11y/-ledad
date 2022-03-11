import { tokenizer, parse } from "./ledad";
import { eatRow } from "./tokenizer/tokensHelps";

let tokens = tokenizer(`
let a = 20;
let b = 10;

`);

;

console.log(parse(tokens));