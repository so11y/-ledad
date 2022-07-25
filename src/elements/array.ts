import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class ArrayExpression implements Ast {
  start: number;
  end: number;
  type = "ArrayExpression";

  elements: Array<Ast> = [];
}

export const initArrayExpression = (parseContext: ParseContext) => {
  const arrayExpression = new ArrayExpression();
  arrayExpression.start = parseContext.currentToken.start;
  parseContext.expect(MachineType.LEFTSQUAREBRACKETS);
  while (!parseContext.eat(MachineType.RIGHTSQUAREBRACKETS)) {
    arrayExpression.elements.push(
      parseExpression(parseContext, {
        functionType: false,
      })
    );
    //eat next MachineType.COMMA
    parseContext.eat(MachineType.COMMA);
  }
  arrayExpression.end = parseContext.prevToken.end;
  return arrayExpression;
};
