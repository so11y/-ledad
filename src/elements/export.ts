import { parseStatement } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { initIdentifier } from "./Identifier";
import { FunctionDeclaration } from "./function";
import { VariableDeclaration } from "./VariableDeclaration";

export class ExportNamedDeclaration implements Ast {
  start: number;
  end: number;
  type = "ExportNamedDeclaration";
  declaration: FunctionDeclaration|VariableDeclaration;
  specifiers: Array<Ast>;
  static isExportNamedDeclaration(node:Record<string,any>):node is ExportNamedDeclaration{
    return node.type === "ExportNamedDeclaration" && node instanceof ExportNamedDeclaration;
  }
}

export const initExportNamedDeclaration = (parseContext: ParseContext) => {
  parseContext.expect(MachineType.EXPORT);
  if (parseContext.scopeStack.length !== 1) {
    parseContext.raise(
      `'import' and 'export' may only appear at the top level `
    );
  }
  const exportNamedDeclaration = new ExportNamedDeclaration();
  exportNamedDeclaration.start = parseContext.prevToken.start;
  const whiteTokenKind = [
    MachineType.ASYNC,
    MachineType.FUNCTION,
    MachineType.VAR,
    MachineType.LET,
    MachineType.CONST,
  ];
  if (whiteTokenKind.some((v) => v === parseContext.currentTokenType)) {
    exportNamedDeclaration.declaration = parseStatement(parseContext) as any;
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
  exportNamedDeclaration.end = parseContext.prevToken.end
  return exportNamedDeclaration;
};
