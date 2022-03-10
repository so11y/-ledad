import { tokenizer, parse } from "./ledad";

//let cc = [function (a,b){},{a:function (z,z){}}];
// let good1 = 1, c = [1,23,{a:1,z:{zz:1,c:[2,3,function(a,b,c){}]}}];
// let a = add(2);
//let cc = [function (a,b){},{a:function(z,z){}}];
//add(,2)
// let good   =  add([1,2],2);
// let g = {a:{a:{d:[1,2,{a:s}]}}}
// a.b([a,b,d,g,d.d.d]);
console.time("sss")
let tokens = tokenizer(`
new a();
`);

// console.log(tokens, 2);

let ast = parse(tokens);
console.timeEnd("sss")
console.log(ast.body);