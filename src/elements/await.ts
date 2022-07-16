import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class AwaitExpression implements Ast {
  type = "AwaitExpression";
  argument: Ast;
}

export const initAwaitExpression = (parseContext: ParseContext) => {
  const awaitExpression = new AwaitExpression();
  parseContext.expect(MachineType.AWAIT);
  awaitExpression.argument = parseExpression(parseContext);
  if (!awaitExpression.argument) {
    parseContext.unexpected();
  }
  return awaitExpression;
};
