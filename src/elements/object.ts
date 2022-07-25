import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { parseExpression } from "../parse/parseStatementOrExpression";
import { Ast } from "../share/types";

class ObjectExpression implements Ast {
  start: number;
  end: number;
  type = "ObjectExpression";
  properties: Array<Property> = [];
}

class Property implements Ast {
  start: number;
  end: number;
  type = "Property";
  key: Ast;
  value: Ast;
}
const initProperty = (parseContext: ParseContext) => {
  const property = new Property();
  parseContext.expectMachineType(
    parseContext.currentTokenType,
    MachineType.IDENTIFIER
  );
  property.key = parseExpression(parseContext);
  property.start = property.key.start;
  parseContext.expect(MachineType.COLON);
  property.value = parseExpression(parseContext, {
    functionType: false,
  });
  property.end = property.value.end;
  return property;
};

export const initObjectExpression = (parseContext: ParseContext) => {
  const objectExpression = new ObjectExpression();
  objectExpression.start = parseContext.currentToken.start;
  parseContext.expect(MachineType.LEFTCURLYBRACES);
  while (!parseContext.eat(MachineType.RIGHTCURLYBRACES)) {
    objectExpression.properties.push(initProperty(parseContext));
    //eat next MachineType.COMMA
    parseContext.eat(MachineType.COMMA);
  }
  objectExpression.end = parseContext.prevToken.start;
  return objectExpression;
};
