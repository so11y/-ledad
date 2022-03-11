import { tokenizer, parse, generator } from "./ledad";

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
50 + 50;
let b =  10;
for(let a = 10;a<5;i++){
    let p = a;
    b = p++;
}
if(b>50){
    console.log('good');
}
function gpp(a,bb){
    let b =  10 + a;
    for(let a = 10;a<5;i++){
        let p = a;
        b = p++;
    }
    if(b<50){
        console.log('这里不能直接b[0]');
        console.log('good',bb.at(0),bb.at(1));
    }
    let b2 =  bb.at(2);
    b2('这里不能连续的括号调用');
    return b;
}
gpp(50,[1,{x:'hello world'},function(h){
    console.log(h);
}]);

`);


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
eval(code);

