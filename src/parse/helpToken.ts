import { RegisterType } from "../share/types";
import { MachineType } from "./machineType";
import { Token, TokenType } from "./tokenizer";

const TokenTypeMap = new Map();
export const registerType = (parentType: TokenType) => {
  const op: RegisterType = {
    register(key: string, type: MachineType) {
      let getTypeMap;
      if (!TokenTypeMap.has(parentType)) {
        getTypeMap = new Map();
        TokenTypeMap.set(parentType, getTypeMap);
      } else {
        getTypeMap = TokenTypeMap.get(parentType);
      }
      getTypeMap.set(key, type);
      return this;
    },
    getType(key: string) {
      return TokenTypeMap.get(parentType).get(key);
    },
  };
  return op;
};

//这里可以改为跟babel一样的注册实现
export const helpToken = (token: Token) => {
  if (token.type === "number" || token.type === "string") {
    return MachineType.IDENTIFIER;
  }
  const type = registerType(token.type as TokenType).getType(token.value);
  if (type) {
    return type;
  }
  if (token.type === "name" && !type) {
    return MachineType.IDENTIFIER;
  }
  throw `SyntaxError: Unexpected token ${token.value}`;
};

const registerSymbol = registerType("symbol");
const registerName = registerType("name");
registerSymbol
  .register(".", MachineType.DOT)
  .register(")", MachineType.RIGHTPARENTHESES)
  .register("(", MachineType.LEFTPARENTHESES)
  .register("]", MachineType.RIGHTSQUAREBRACKETS)
  .register("[", MachineType.LEFTSQUAREBRACKETS)
  .register(":", MachineType.COLON)
  .register("}", MachineType.RIGHTCURLYBRACES)
  .register("{", MachineType.LEFTCURLYBRACES)
  .register(",", MachineType.COMMA)
  .register(";", MachineType.SEMICOLON);

registerName
  .register("!==", MachineType.BINARY)
  .register("===", MachineType.BINARY)
  .register("==", MachineType.BINARY)
  .register("!=", MachineType.BINARY)
  .register("*", MachineType.BINARY)
  .register("/", MachineType.BINARY)
  .register("-", MachineType.BINARY)
  .register("+", MachineType.BINARY)
  .register("<", MachineType.BINARY)
  .register(">", MachineType.BINARY)
  .register("=", MachineType.EQUALLING)
  .register("&&", MachineType.LOGICAL)
  .register("||", MachineType.LOGICAL)
  .register("if", MachineType.IF)
  .register("return", MachineType.RETURN)
  .register("function", MachineType.FUNCTION)
  .register("let", MachineType.LET)
  .register("var", MachineType.VAR)
  .register("const", MachineType.CONST)
  .register("while", MachineType.WHILE)
  .register("break", MachineType.BREAK)
  .register("async", MachineType.ASYNC)
  .register("await", MachineType.AWAIT)
  .register("import", MachineType.IMPORT)
  .register("export", MachineType.EXPORT)
