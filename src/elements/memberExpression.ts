import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { initIdentifier } from "./Identifier";
import { MachineType } from "../parse/machineType";

class MemberExpression implements Ast {
  start: number;
  end: number;
  type = "MemberExpression";
  object: Ast;
  property: Ast;
}

export const initMemberExpression = (
  parseContext: ParseContext,
  element: Ast
) => {
  const memberExpression = new MemberExpression();
  memberExpression.object = element;
  memberExpression.start = element.start;
  const currentToken = parseContext.currentToken;
  parseContext.expect(MachineType.IDENTIFIER);
  memberExpression.property = initIdentifier(currentToken.value);
  memberExpression.end = memberExpression.property.end;
  return memberExpression;
};
