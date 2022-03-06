import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


//let cc = [function (a,b){},{a:function (z,z){}}];
//let good   =  [1,[2,3],{a:[4,5],p:{gg:6}}];
let tokens = tokenizer(`

let cc = [function (a,b){},{a:function gg(z,z){}}];
`);
console.log(tokens);

let ast = parse(tokens);

console.log(ast);


