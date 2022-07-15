import { ParseContext } from "../parse/parse";
import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType, Variable } from "../parse/MachineType";
import { Ast } from "../share/types";
import { Identifier } from "./Identifier";

class VariableDeclaration implements Ast {
  type = "VariableDeclaration";
  declarations: Array<Ast> = [];
  kind: Variable;
}
class VariableDeclarator implements Ast {
  type = "VariableDeclarator";
  id: Ast;
  init: Ast;
}
const initVariableDeclarator = (parseContext: ParseContext, kind: Variable) => {
  const variableDeclarator = new VariableDeclarator();
  variableDeclarator.id = parseExpression(parseContext);
  parseContext.expect(MachineType.EQUALLING);
  variableDeclarator.init = parseExpression(parseContext);
  if (variableDeclarator.id instanceof Identifier) {
    parseContext.currentScope().addVarScope(variableDeclarator.id.name, kind);
  }
  return variableDeclarator;
};

export const initVariableDeclaration = (parseContext: ParseContext) => {
  const variableDeclaration = new VariableDeclaration();
  variableDeclaration.kind =
    parseContext.currentTokenType as VariableDeclaration["kind"];
  //eat let or var or const
  parseContext.eat(parseContext.currentTokenType);
  variableDeclaration.declarations.push(
    initVariableDeclarator(parseContext, variableDeclaration.kind)
  );
  while (parseContext.eat(MachineType.COMMA)) {
    variableDeclaration.declarations.push(
      initVariableDeclarator(parseContext, variableDeclaration.kind)
    );
  }
  return variableDeclaration;
};
