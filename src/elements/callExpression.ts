import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class CallExpression implements Ast {
  type = "CallExpression";
  callee: Ast;
  arguments: Array<Ast> = [];
}

export const initCallExpression = (
  element: Ast,
  argument: Array<Ast>
) => {
  const callExpression = new CallExpression();
  callExpression.callee = element;
  callExpression.arguments = argument;
  return callExpression;
};
