import { Operation } from "../parse/machineType";
import { Ast } from "../share/types";

class BinaryExpression implements Ast {
  start: number;
  end: number;
  type = "BinaryExpression";
  left: Ast;
  operator: Operation;
  right: Ast;
}

export const initBinaryExpression = (left: Ast, right: Ast, operator: any) => {
  const binaryExpression = new BinaryExpression();
  binaryExpression.start = left.start;
  binaryExpression.left = left;
  binaryExpression.operator = operator;
  binaryExpression.right = right;
  binaryExpression.end = right.end;
  return binaryExpression;
};
