import { tokenizer, parse ,generator } from "./ledad";

//let cc = [function (a,b){},{a:function (z,z){}}];
// let good1 = 1, c = [1,23,{a:1,z:{zz:1,c:[2,3,function(a,b,c){}]}}];
// let a = add(2);
//let cc = [function (a,b){},{a:function(z,z){}}];
//add(,2)
// let good   =  add([1,2],2);
// let g = {a:{a:{d:[1,2,{a:s}]}}}
// a.b([a,b,d,g,d.d.d]);


console.time("编译用时:")
let tokens = tokenizer(`
let  p = 10+10;
d(a+3,[3,2,2])

`);

// console.log(tokens, 2);

let ast = parse(tokens);
let code = generator(ast.body);
console.timeEnd("编译用时:")
console.group();
console.log("打印代码Ast:");
console.log(ast.body);
console.groupEnd();
console.log("--------分割线--------");
console.group();
console.log("打印编译代码:");
console.log(code);
console.groupEnd();

console.log("--------分割线--------");
console.log('--------开始执行------');
// eval(code);

