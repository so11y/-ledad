import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { initIdentifier } from "./Identifier";
import { MachineType } from "../parse/MachineType";

class MemberExpression implements Ast {
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
  const currentToken = parseContext.currentToken;
  parseContext.expect(MachineType.IDENTIFIER);
  memberExpression.property = initIdentifier(currentToken.value);
  return memberExpression;
};
