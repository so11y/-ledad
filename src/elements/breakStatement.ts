import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

export class BreakStatement implements Ast {
  start: number;
  end: number;
  type = "BreakStatement";
}

export const initBreakStatement = (parseContext: ParseContext) => {
  if (!parseContext.inFor) {
    parseContext.unexpected();
  }
  const breakStatement = new BreakStatement();
  breakStatement.start = parseContext.currentToken.start;
  breakStatement.end = parseContext.currentToken.end;
  parseContext.expect(MachineType.BREAK);
  return breakStatement;
};
