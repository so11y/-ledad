import { Ast } from "../share/types";

class ExpressionStatement implements Ast {
  type = "ExpressionStatement";
  expression: Ast;
}

export const initExpressionStatement = (expression: Ast) => {
  const expressionStatement = new ExpressionStatement();
  expressionStatement.expression = expression;
  return expressionStatement;
};
