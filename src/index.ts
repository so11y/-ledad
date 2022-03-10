import { tokenizer, parse ,generator } from "./ledad";

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
let a = [1,3,{a:'222'}];
const ccc = new a.g.g(a.g,{g:2,c:222,d:[1,2,{g:2}]},555);
 new a.g.g();
[c.d.g.wqqqqq(2,3,3,5,5,5),c.d.g.wqqqqq(2,3,3,5,5,5)];
`);

// console.log(tokens, 2);

let ast = parse(tokens);
let code = generator(ast.body);
console.timeEnd("sss")
console.log(ast.body);
console.log(code);