import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/MachineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class ReturnStatement implements Ast {
  type = "ReturnStatement";
  argument: Ast;
}

export const initReturnStatement = (parseContext: ParseContext) => {
  if (!parseContext.inFunction) {
    parseContext.raise(`'return' outside of function`);
  }
  const returnStatement = new ReturnStatement();
  parseContext.expect(MachineType.RETURN);
  returnStatement.argument = parseExpression(parseContext);
  return returnStatement;
};
