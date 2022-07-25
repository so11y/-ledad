import { Ast } from "../share/types";

class SequenceExpression implements Ast {
  start: number;
  end: number;
  type = "SequenceExpression";
  expressions: Array<Ast>;
}

export const initSequenceExpression = (expression: Array<Ast>) => {
  const expressionStatement = new SequenceExpression();
  expressionStatement.start = expression[0].start;
  expressionStatement.expressions = expression;
  expressionStatement.end = expression.at(-1).start;
  return expressionStatement;
};
