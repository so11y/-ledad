import { Ast } from "./AstTypes/ast";
import { ObjectExpression, ObjectProperty } from "./AstTypes/ObjectExpression"
import { VariableDeclaration, VariableDeclarator } from "./AstTypes/VariableDeclaration"

//随便搞一手,不想搞了
export const traverse = (Ast: Array<Ast>, t: any) => {
    const walkAst = (ast: Ast, parentAst: Ast, parentIndex?: number) => {
        if (!ast) return;
        if (ast instanceof ObjectExpression) {
            if (t.ObjectExpression) t.ObjectExpression(ast, parentAst, parentIndex);
            if (ast.properties) ast.properties.forEach((v, i) => walkAst(v, ast, i));
        } else if (ast instanceof ObjectProperty) {
            if (t.ObjectProperty) t.ObjectProperty(ast, parentAst, parentIndex);
            if (ast.key) walkAst(ast.key, ast)
            if (ast.value) walkAst(ast.value, ast)
        } else if (ast instanceof VariableDeclaration) {
            if (t.VariableDeclaration) t.VariableDeclaration(ast, parentAst, parentIndex);
            if (ast.declarations) ast.declarations.forEach((v, i) => walkAst(v, ast, i));
        } else if (ast instanceof VariableDeclarator) {
            if (t.VariableDeclarator) t.VariableDeclarator(ast, parentAst, parentIndex);
            if (ast.id) walkAst(ast.id, ast);
            if (ast.init) walkAst(ast.init, ast);
        }
    }
    for (let i = 0; i < Ast.length; i++) {
        walkAst(Ast[i], Ast as any, i)
    }
}