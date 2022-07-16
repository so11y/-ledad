import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { parseExpression } from "../parse/parseStatementOrExpression";
import { Ast } from "../share/types";

class ObjectExpression implements Ast {
  type = "ObjectExpression";
  properties: Array<Property> = [];
}

class Property implements Ast {
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
  parseContext.expect(MachineType.COLON);
  property.value = parseExpression(parseContext, {
    functionType: false,
  });
  return property;
};

export const initObjectExpression = (parseContext: ParseContext) => {
  const objectExpression = new ObjectExpression();
  parseContext.expect(MachineType.LEFTCURLYBRACES);
  while (!parseContext.eat(MachineType.RIGHTCURLYBRACES)) {
    objectExpression.properties.push(initProperty(parseContext));
    //eat next MachineType.COMMA
    parseContext.eat(MachineType.COMMA);
  }
  return objectExpression;
};
