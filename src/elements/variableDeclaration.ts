import { ParseContext } from "../parse/parse";
import {
  parseExpression,
  parseMaybeUnary,
} from "../parse/parseStatementOrExpression";
import { MachineType, Variable } from "../parse/machineType";
import { Ast } from "../share/types";
import { Identifier } from "./Identifier";

export class VariableDeclaration implements Ast {
  start: number;
  end: number;
  type = "VariableDeclaration";
  declarations: Array<VariableDeclarator> = [];
  kind: Variable;

  static isVariableDeclaration(
    node: Record<string, any>
  ): node is VariableDeclaration {
    return (
      node.type === "VariableDeclaration"
    );
  }
}
export class VariableDeclarator implements Ast {
  start: number;
  end: number;
  type = "VariableDeclarator";
  id: Ast;
  init: Ast;

  static isVariableDeclarator(
    node: Record<string, any>
  ): node is VariableDeclaration {
    return (
      node.type === "VariableDeclarator" && node instanceof VariableDeclarator
    );
  }
}
const initVariableDeclarator = (parseContext: ParseContext, kind: Variable) => {
  const variableDeclarator = new VariableDeclarator();
  variableDeclarator.id = parseMaybeUnary(parseContext);
  variableDeclarator.start = variableDeclarator.id.start;
  parseContext.expect(MachineType.EQUALLING);
  variableDeclarator.init = parseExpression(parseContext);
  variableDeclarator.end = variableDeclarator.init.end;
  if (variableDeclarator.id instanceof Identifier) {
    parseContext.currentScope().addVarScope(variableDeclarator.id.name, kind);
  }
  return variableDeclarator;
};

export const initVariableDeclaration = (parseContext: ParseContext) => {
  const variableDeclaration = new VariableDeclaration();
  variableDeclaration.kind =
    parseContext.currentTokenType as VariableDeclaration["kind"];
  variableDeclaration.start = parseContext.currentToken.start;
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
  variableDeclaration.end = parseContext.prevToken.end;
  return variableDeclaration;
};
