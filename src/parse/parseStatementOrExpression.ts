import { initExpressionStatement } from "../elements/expressionStatement";
import { initSequenceExpression } from "../elements/sequence";
import { initIdentifier } from "../elements/Identifier";
import { Ast } from "../share/types";
import { MachineType } from "./MachineType";
import { ParseContext } from "./parse";
import { initVariableDeclaration } from "../elements/VariableDeclaration";
import { initLiteral } from "../elements/literal";
import { initObjectExpression } from "../elements/object";
import { initArrayExpression } from "../elements/array";
import { initFunctionDeclaration } from "../elements/function";

const normalizationIDENTIFIER = (parseContext: ParseContext) => {
  let node;
  if (
    parseContext.currentToken.type === "string" ||
    parseContext.currentToken.type === "number"
  ) {
    node = initLiteral(parseContext.currentToken.value);
  } else {
    node = initIdentifier(parseContext.currentToken.value);
  }
  return node;
};

export const parseExpression = (
  parseContext: ParseContext,
  options = { functionType: true }
): Ast => {
  switch (parseContext.tokenType()) {
    //@ts-ignore
    case MachineType.LEFTCURLYBRACES:
      return initObjectExpression(parseContext);
    case MachineType.SEMICOLON:
      parseContext.eat(MachineType.SEMICOLON);
      break;
    case MachineType.LEFTSQUAREBRACKETS:
      return initArrayExpression(parseContext);
    case MachineType.IDENTIFIER:
      const node = normalizationIDENTIFIER(parseContext);
      parseContext.eat(MachineType.IDENTIFIER);
      return node;
    case MachineType.FUNCTION:
      return initFunctionDeclaration(parseContext, options.functionType);
    default:
      console.log("什么情况?->>", parseContext.tokenType());
      break;
  }
};

const parseExpressionStatement = (children: Array<Ast>) => {
  let node = children[0];
  if (children.length > 1) {
    node = initSequenceExpression(children);
  }
  return initExpressionStatement(node);
};

export const parseStatement = (
  parseContext: ParseContext,
  options = { functionType: true }
): Ast => {
  switch (parseContext.currentTokenType) {
    case MachineType.LET:
    case MachineType.VAR:
    case MachineType.CONST:
      return initVariableDeclaration(parseContext);
    case MachineType.SEMICOLON:
      parseContext.eat(MachineType.SEMICOLON);
      break;
    case MachineType.FUNCTION:
      return initFunctionDeclaration(parseContext, options.functionType);
    default:
      const children: Array<Ast> = [];
      children.push(parseExpression(parseContext));
      while (parseContext.eat(MachineType.COMMA)) {
        children.push(parseExpression(parseContext));
      }
      return parseExpressionStatement(children);
  }
};
