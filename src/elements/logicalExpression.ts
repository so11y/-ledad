import { Logical } from "../parse/machineType";
import { Ast } from "../share/types";

class LogicalExpression implements Ast {
  start: number;
  end: number;
  type = "LogicalExpression";
  left: Ast;
  operator: Logical;
  right: Ast;
}

export const initLogicalExpression = (left: Ast, right: Ast, operator: any) => {
  const logicalExpression = new LogicalExpression();
  logicalExpression.left = left;
  logicalExpression.start = left.start;
  logicalExpression.operator = operator as any;
  logicalExpression.right = right;
  logicalExpression.end = right.start;
  return logicalExpression;
};
