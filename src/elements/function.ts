import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/MachineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { BlockStatement, initBlockStatement } from "./block";
import { Identifier } from "./Identifier";

class FunctionDeclaration implements Ast {
  type = "FunctionDeclaration";
  id: Identifier;
  expression = false;
  generator = false;
  async = false;
  params: Array<Ast> = [];
  body: BlockStatement;
}

class FunctionExpression extends FunctionDeclaration {
  type = "FunctionExpression";
}

const createFunction = (type = true) => {
  if (type) {
    return new FunctionDeclaration();
  }
  return new FunctionExpression();
};
export const initFunctionDeclaration = (
  parseContext: ParseContext,
  type = true
) => {
  const _function = createFunction(type);
  const parentScope = parseContext.currentScope();
  parseContext.enterScope(2);
  parseContext.expect(MachineType.FUNCTION);
  if (parseContext.currentTokenType === MachineType.IDENTIFIER) {
    _function.id = parseExpression(parseContext) as Identifier;
    parentScope.addFunctionScope(_function.id.name);
  }
  parseContext.expect(MachineType.LEFTPARENTHESES);
  while (!parseContext.eat(MachineType.RIGHTPARENTHESES)) {
    _function.params.push(parseExpression(parseContext));
    //eat next MachineType.COMMA
    parseContext.eat(MachineType.COMMA);
  }
  _function.body = initBlockStatement(parseContext);
  parseContext.exitScope();
  return _function;
};
