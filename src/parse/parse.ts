import { Ast } from "../share/types";
import { helpToken } from "./helpToken";
import { MachineType, Variable } from "./machineType";
import { parseStatement } from "./parseStatementOrExpression";
import { Token } from "./tokenizer";

class Scope {
  flags: number;
  var: Array<{
    name: string;
    kind: Variable;
  }> = [];
  functions: Array<string> = [];
  constructor(flags: number) {
    this.flags = flags;
  }
}

export class ParseContext {
  scopeStack: Array<Scope> = [];
  prevToken: Token;
  constructor(private tokens: Array<Token>) {
    this.enterScope(1);
  }

  tokenType(token?: Token) {
    if (!this.isOFEnd) {
      return MachineType.EOF;
    }
    if (!token) token = this.tokens[0];
    return helpToken(token);
  }
  shift() {
    this.prevToken = this.tokens.shift();
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

  get inFunction() {
    const scope = this.currentVarScope(2);
    return scope ? true : false;
  }

  get inFor() {
    const scope = this.currentVarScope(3);
    return scope ? true : false;
  }

  currentScope() {
    const currentScope = this.scopeStack[this.scopeStack.length - 1];
    const lets = currentScope.var.filter((v) => v.kind === MachineType.LET);
    const consts = currentScope.var.filter((v) => v.kind === MachineType.CONST);
    const functions = currentScope.functions;
    return {
      currentScope,
      addFunctionScope: (name: string) => {
        if (
          lets.every((v) => v.name !== name) &&
          consts.every((v) => v.name !== name)
        ) {
          currentScope.functions.push(name);
          return;
        }
        this.raise(`Identifier '${name}' has already been declared`);
      },
      addVarScope: (name: string, kind: Variable) => {
        switch (kind) {
          case MachineType.VAR:
            if (
              lets.every((v) => v.name !== name) &&
              consts.every((v) => v.name !== name)
            ) {
              currentScope.var.push({
                kind,
                name,
              });
              return;
            }
            this.raise(`Identifier '${name}' has already been declared`);
            break;
          default:
            if (
              lets.every((v) => v.name !== name) &&
              consts.every((v) => v.name !== name) &&
              functions.every((v) => v !== name)
            ) {
              currentScope.var.push({
                kind,
                name,
              });
              return;
            }
            this.raise(`Identifier '${name}' has already been declared`);
            break;
        }
      },
    };
  }

  currentVarScope(flags = 1) {
    for (var i = this.scopeStack.length - 1; i >= 0; i--) {
      var scope = this.scopeStack[i];
      if (scope.flags >= flags) {
        return scope;
      }
    }
  }

  eat(type: MachineType) {
    if (this.currentTokenType === type) {
      this.shift();
      return true;
    } else {
      return false;
    }
  }

  enterScope(flags: number) {
    this.scopeStack.push(new Scope(flags));
  }
  exitScope() {
    this.scopeStack.pop();
  }

  raise(message: string) {
    throw new SyntaxError(message);
  }

  expect(type: MachineType) {
    if (!this.eat(type)) {
      this.unexpected();
    }
  }
  unexpected() {
    this.raise("Unexpected token");
  }

  expectMachineType(type1: MachineType, type2: MachineType) {
    if (type1 !== type2) {
      this.unexpected();
    }
  }
}
export class Program implements Ast {
  start: number;
  end: number;
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
