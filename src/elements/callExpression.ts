import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class CallExpression implements Ast {
  start: number;
  end: number;
  type = "CallExpression";
  callee: Ast;
  arguments: Array<Ast> = [];
}

export const initCallExpression = (element: Ast, argument: Array<Ast>) => {
  const callExpression = new CallExpression();
  callExpression.start = element.start;
  callExpression.callee = element;
  callExpression.arguments = argument;
  callExpression.end = argument.at(-1).end;
  return callExpression;
};
