import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


let tokens = tokenizer(`
let cc = 10,p = 5;
function good(a,b,g){

}
let good   = {
    'a' :'1',
    b :{
        c :2 ,
        g :2020
      }
    },
    z= 50
;

`);

console.log(tokens);

let ast = parse(tokens);

console.log(ast);
// let ast = parseContext();

// console.log(ast);

