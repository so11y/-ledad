import { Operation } from "../parse/machineType";
import { Ast } from "../share/types";

class BinaryExpression implements Ast {
  type = "BinaryExpression";
  left: Ast;
  operator: Operation;
  right: Ast;
}

export const initBinaryExpression = (left: Ast, right: Ast, operator: any) => {
  const binaryExpression = new BinaryExpression();
  binaryExpression.left = left;
  binaryExpression.operator = operator;
  binaryExpression.right = right;
  return binaryExpression;
};
