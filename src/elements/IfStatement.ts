import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { initBlockStatement } from "./block";

export class IfStatement implements Ast {
  start: number;
  end: number;
  type = "Identifier";
  test: Ast;
  consequent: Ast;
}

export const initIfStatement = (parseContext: ParseContext) => {
  const ifStatement = new IfStatement();
  ifStatement.start = parseContext.currentToken.start
  parseContext.expect(MachineType.IF);
  parseContext.expect(MachineType.LEFTPARENTHESES);
  if (parseContext.currentTokenType === MachineType.RIGHTPARENTHESES) {
    parseContext.unexpected();
  }
  ifStatement.test = parseExpression(parseContext);
  parseContext.expect(MachineType.RIGHTPARENTHESES);
  ifStatement.consequent = initBlockStatement(parseContext);
  ifStatement.end =ifStatement.consequent.end
  return ifStatement;
};
