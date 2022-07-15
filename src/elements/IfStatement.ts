import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/MachineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { initBlockStatement } from "./block";

export class IfStatement implements Ast {
  type = "Identifier";
  test: Ast;
  consequent: Ast;
}

export const initIfStatement = (parseContext: ParseContext) => {
  const ifStatement = new IfStatement();
  parseContext.expect(MachineType.IF);
  parseContext.expect(MachineType.LEFTPARENTHESES);
  if (parseContext.currentTokenType === MachineType.RIGHTPARENTHESES) {
    parseContext.unexpected();
  }
  ifStatement.test = parseExpression(parseContext);
  parseContext.expect(MachineType.RIGHTPARENTHESES);
  ifStatement.consequent = initBlockStatement(parseContext);
  return ifStatement;
};
