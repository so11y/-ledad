import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/MachineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

class ArrayExpression implements Ast {
  type = "ArrayExpression";
  elements: Array<Ast> = [];
}

export const initArrayExpression = (parseContext: ParseContext) => {
  const arrayExpression = new ArrayExpression();
  parseContext.expect(MachineType.LEFTSQUAREBRACKETS);
  while (!parseContext.eat(MachineType.RIGHTSQUAREBRACKETS)) {
    arrayExpression.elements.push(parseExpression(parseContext,{
      functionType:false
    }));
    //eat next MachineType.COMMA
    parseContext.eat(MachineType.COMMA);
  }
  return arrayExpression;
};
