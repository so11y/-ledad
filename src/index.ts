import { Identifier } from "./AstTypes/Identifier";
import { NewExpression } from "./AstTypes/NewExpression";
import { tokenizer, parse, generator, traverse } from "./ledad";

console.time("编译用时:")
let tokens = tokenizer(`
const s = {
    val: 1,
    left: {
        val: 2,
        left: null,
        right: null
    },
    right: {
        val: 5,
        left: null,
        right: null
    }
};
`);

let ast = parse(tokens);

traverse(ast.body, {
    ObjectExpression(path, b: any) {
        const newExpression = new NewExpression();
        const identifier = new Identifier();;
        identifier.name = "TreeNode";
        const walk = (path) => {
            let childs = path.properties.map(v => v.value);
            if (path && path.properties.length) {
                const f = childs.filter((v) => ((v as any).name !== "null"));
                if (f.length === 1) {
                    childs = childs.slice(0, 1);
                } else if (f.length === 2) {
                    const rightNull = (childs[2] as any).name !== "null";
                    if (rightNull) {
                        childs = childs.slice(0, 2);
                    }
                }
                childs = childs.map(v => {
                    if (v.type === "Literal") {
                        return v;
                    } else {
                        const newExpression = new NewExpression();
                        const identifier = new Identifier();;
                        identifier.name = "TreeNode";
                        newExpression.callee = identifier;
                        newExpression.arguments = walk(v)
                        return newExpression;
                    }
                })
            }
            return childs
        }

        if (b.init) {
            b.init = newExpression;
            newExpression.callee = identifier;
            newExpression.arguments = walk(path);
        }
    },
});
let code = generator(ast.body);
console.timeEnd("编译用时:")
console.group("打印代码Ast:");
console.log(ast.body);
console.groupEnd();
console.group("打印编译代码:");
console.log(code);
console.groupEnd();
console.group('--------开始执行------');
// eval(code);
console.groupEnd();
