import { Ast } from "../share/types";
import { helpToken } from "./helpToken";
import { MachineType } from "./MachineType";
import { parseStatement } from "./parseStatementOrExpression";
import { Token } from "./tokenizer";

export class ParseContext {
  constructor(private tokens: Array<Token>) {}

  tokenType(token?: Token) {
    if (!token) token = this.tokens[0];
    return helpToken(token);
  }

  get currentTokenType() {
    return this.tokenType();
  }

  get isOFEnd() {
    return this.tokens.length > 0;
  }

  get currentToken() {
    return this.tokens[0];
  }

  eat(type: MachineType) {
    if (this.currentTokenType === type) {
      this.tokens.shift();
      return true;
    } else {
      return false;
    }
  }
}
class Program implements Ast {
  type = "Program";
  body: Array<Ast> = [];
}

export const parse = (tokens: Array<Token>): Program => {
  const program = new Program();
  const parseContext = new ParseContext(tokens);
  while (parseContext.isOFEnd) {
    const element = parseStatement(parseContext);
    if (element) {
      program.body.push(element);
    }
  }
  return program;
};
