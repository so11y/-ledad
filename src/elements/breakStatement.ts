import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

export class BreakStatement implements Ast {
  type = "BreakStatement";
}

export const initBreakStatement = (parseContext: ParseContext) => {
  if (!parseContext.inFor) {
    parseContext.unexpected();
  }
  const breakStatement = new BreakStatement();
  parseContext.expect(MachineType.BREAK);
  return breakStatement;
};
