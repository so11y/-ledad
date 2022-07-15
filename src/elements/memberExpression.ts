import { parseExpression } from "../parse/parseStatementOrExpression";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

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
  memberExpression.property = parseExpression(parseContext);
  return memberExpression;
};
