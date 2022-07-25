import { Ast } from "../share/types";

class ExpressionStatement implements Ast {
  start: number;
  end: number;
  type = "ExpressionStatement";
  expression: Ast;
}

export const initExpressionStatement = (expression: Ast) => {
  const expressionStatement = new ExpressionStatement();
  expressionStatement.start = expression.start;
  expressionStatement.end = expression.end;
  expressionStatement.expression = expression;
  return expressionStatement;
};
