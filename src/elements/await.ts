import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class AwaitExpression implements Ast {
  start: number;
  end: number;
  type = "AwaitExpression";
  argument: Ast;
}

export const initAwaitExpression = (parseContext: ParseContext) => {
  const awaitExpression = new AwaitExpression();
  awaitExpression.start = parseContext.currentToken.start;
  parseContext.expect(MachineType.AWAIT);
  awaitExpression.argument = parseExpression(parseContext);
  if (!awaitExpression.argument) {
    parseContext.unexpected();
  }
  awaitExpression.end = awaitExpression.argument.end;
  return awaitExpression;
};
