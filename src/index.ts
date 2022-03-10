import { tokenizer } from "./tokenizer";
import { parse } from "./parse";


//let cc = [function (a,b){},{a:function (z,z){}}];
// let good1 = 1, c = [1,23,{a:1,z:{zz:1,c:[2,3,function(a,b,c){}]}}];
// let a = add(2);

//add(,2)
// let good   =  add([1,2],2);
let tokens = tokenizer(`
a.b({a:g});
`);

console.log(tokens,2);

let ast = parse(tokens);
console.log(ast.body);
