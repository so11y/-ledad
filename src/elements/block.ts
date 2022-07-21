import { parseStatement } from "../parse/parseStatementOrExpression";
import { MachineType } from "../parse/machineType";
import { ParseContext } from "../parse/parse";
import { Ast } from "../share/types";

export class BlockStatement implements Ast {
  type = "BlockStatement";
  body: Array<Ast> = [];
}

export const initBlockStatement = (parseContext: ParseContext) => {
  const blockStatement = new BlockStatement();
  parseContext.enterScope(1);
  parseContext.expect(MachineType.LEFTCURLYBRACES);
  while (!parseContext.eat(MachineType.RIGHTCURLYBRACES)) {
    const node = parseStatement(parseContext);
    if(node){
      blockStatement.body.push(node);
    }
  }
  parseContext.exitScope();
  return blockStatement;
};
