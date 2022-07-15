import { Ast } from "../share/types";

class SequenceExpression implements Ast {
  type = "SequenceExpression";
  expressions: Array<Ast>;
}

export const initSequenceExpression = (expression: Array<Ast>) => {
  const expressionStatement = new SequenceExpression();
  expressionStatement.expressions = expression;
  return expressionStatement;
};
