import { ParseContext } from "../parse/parse";
import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/MachineType";
import { Ast } from "../share/types";

class VariableDeclaration implements Ast {
  type = "VariableDeclaration";
  declarations: Array<Ast> = [];
  kind: MachineType.LET | MachineType.CONST | MachineType.VAR;
}
class VariableDeclarator implements Ast {
  type = "VariableDeclarator";
  id: Ast;
  init: Ast;
}
const initVariableDeclarator = (parseContext: ParseContext) => {
  const variableDeclarator = new VariableDeclarator();
  variableDeclarator.id = parseExpression(parseContext);
  parseContext.eat(MachineType.EQUALLING);
  variableDeclarator.init = parseExpression(parseContext);
  return variableDeclarator;
};

export const initVariableDeclaration = (parseContext: ParseContext) => {
  const variableDeclaration = new VariableDeclaration();
  variableDeclaration.kind =
    parseContext.currentTokenType as VariableDeclaration["kind"];
  //eat let or var or const
  parseContext.eat(parseContext.currentTokenType);
  variableDeclaration.declarations.push(initVariableDeclarator(parseContext));
  while (parseContext.eat(MachineType.COMMA)) {
    variableDeclaration.declarations.push(initVariableDeclarator(parseContext));
  }
  return variableDeclaration;
};
