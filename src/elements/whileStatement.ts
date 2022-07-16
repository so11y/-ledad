import {
  parseExpression,
  parseMaybeUnary,
} from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { BlockStatement, initBlockStatement } from "./block";

export class WhileStatement implements Ast {
  type = "WhileStatement";
  test: Ast;
  body: BlockStatement;
}

export const initWhileStatement = (parseContext: ParseContext) => {
  const whileStatement = new WhileStatement();
  parseContext.expect(MachineType.WHILE);
  parseContext.expect(MachineType.LEFTPARENTHESES);
  if(parseContext.currentTokenType === MachineType.RIGHTPARENTHESES){
    parseContext.unexpected();
  }
  whileStatement.test = parseExpression(parseContext);
  parseContext.expect(MachineType.RIGHTPARENTHESES);
  parseContext.enterScope(3);
  whileStatement.body = initBlockStatement(parseContext);
  parseContext.exitScope();
  return whileStatement;
};
