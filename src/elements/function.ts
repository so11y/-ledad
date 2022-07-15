import { parseExpression } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/MachineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";
import { BlockStatement, initBlockStatement } from "./BlockStatement";

class FunctionDeclaration implements Ast {
  type = "FunctionDeclaration";
  id: Ast;
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
  parseContext.eat(MachineType.FUNCTION);
  _function.id = parseExpression(parseContext);
  parseContext.eat(MachineType.LEFTPARENTHESES);
  while (!parseContext.eat(MachineType.RIGHTPARENTHESES)) {
    _function.params.push(parseExpression(parseContext));
    //eat next MachineType.COMMA
    parseContext.eat(MachineType.COMMA);
  }
  _function.body = initBlockStatement(parseContext);
  return _function;
};
