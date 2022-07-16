import { Logical } from "../parse/machineType";
import { Ast } from "../share/types";

class LogicalExpression implements Ast {
  type = "LogicalExpression";
  left: Ast;
  operator: Logical;
  right: Ast;
}

export const initLogicalExpression = (left: Ast, right: Ast, operator: any) => {
  const logicalExpression = new LogicalExpression();
  logicalExpression.left = left;
  logicalExpression.operator = operator as any;
  logicalExpression.right = right;
  return logicalExpression;
};
