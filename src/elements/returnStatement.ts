import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class ReturnStatement implements Ast {
  start: number;
  end: number;
  type = "ReturnStatement";
  argument: Ast;
}

export const initReturnStatement = (parseContext: ParseContext) => {
  if (!parseContext.inFunction) {
    parseContext.raise(`'return' outside of function`);
  }
  const returnStatement = new ReturnStatement();
  returnStatement.start = parseContext.currentToken.start
  parseContext.expect(MachineType.RETURN);
  returnStatement.argument = parseExpression(parseContext);
  returnStatement.end = returnStatement.argument.end
  return returnStatement;
};
