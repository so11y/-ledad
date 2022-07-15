import { MachineType } from "./MachineType";
import { Token } from "./tokenizer";

//这里可以改为跟babel一样的注册实现
export const helpToken = (token: Token) => {
  switch (token.type) {
    case "name":
    case "number":
      switch (token.value) {
        case "let":
          return MachineType.LET;
        case "const":
          return MachineType.CONST;
        case "var":
          return MachineType.VAR;
        case "function":
          return MachineType.FUNCTION;
        case "if":
          return MachineType.IF;
        case "return":
          return MachineType.RETURN;
        default:
          return MachineType.IDENTIFIER;
      }
    case "symbol":
      switch (token.value) {
        case "=":
          return MachineType.EQUALLING;
        case ";":
          return MachineType.SEMICOLON;
        case ",":
          return MachineType.COMMA;
        case "{":
          return MachineType.LEFTCURLYBRACES;
        case "}":
          return MachineType.RIGHTCURLYBRACES;
        case ":":
          return MachineType.COLON;
        case "[":
          return MachineType.LEFTSQUAREBRACKETS;
        case "]":
          return MachineType.RIGHTSQUAREBRACKETS;
        case "(":
          return MachineType.LEFTPARENTHESES;
        case ")":
          return MachineType.RIGHTPARENTHESES;
      }
    default:
      throw `SyntaxError: Unexpected token ${token.value}`;
  }
};
