import { parseStatement } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { initIdentifier } from "./Identifier";

export class ExportNamedDeclaration implements Ast {
  type = "ExportNamedDeclaration";
  declaration: Ast;
  specifiers: Array<Ast>;
}

export const initExportNamedDeclaration = (parseContext: ParseContext) => {
  parseContext.expect(MachineType.EXPORT);
  if (parseContext.scopeStack.length !== 1) {
    parseContext.raise(
      `'import' and 'export' may only appear at the top level `
    );
  }
  const exportNamedDeclaration = new ExportNamedDeclaration();
  const whiteTokenKind = [
    MachineType.ASYNC,
    MachineType.FUNCTION,
    MachineType.VAR,
    MachineType.LET,
    MachineType.CONST,
  ];
  if (whiteTokenKind.some((v) => v === parseContext.currentTokenType)) {
    exportNamedDeclaration.declaration = parseStatement(parseContext);
  } else if (parseContext.eat(MachineType.LEFTCURLYBRACES)) {
    exportNamedDeclaration.specifiers = [];
    while (!parseContext.eat(MachineType.RIGHTCURLYBRACES)) {
      if (parseContext.currentTokenType !== MachineType.IDENTIFIER) {
        parseContext.unexpected();
      }
      const name = parseContext.currentToken.value;
      const scope = parseContext.currentVarScope();
      if (
        scope.var.find((v) => v.name === name) ||
        scope.functions.find((v) => v === name)
      ) {
        exportNamedDeclaration.specifiers.push(initIdentifier(name));
        parseContext.eat(MachineType.IDENTIFIER);
        parseContext.eat(MachineType.COMMA);
      } else {
        parseContext.unexpected();
      }
    }
  } else {
    parseContext.unexpected();
  }
  return exportNamedDeclaration;
};
