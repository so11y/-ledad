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
import { initIfStatement } from "../elements/IfStatement";
import { initReturnStatement } from "../elements/returnStatement";
import { initMemberExpression } from "../elements/MemberExpression";
import { initCallExpression } from "../elements/CallExpression";

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

const parseExpressionAndStatement = (
  parseContext: ParseContext,
  options = { functionType: true }
): Ast => {
  switch (parseContext.tokenType()) {
    case MachineType.FUNCTION:
      return initFunctionDeclaration(parseContext, options.functionType);
    case MachineType.IF:
      return initIfStatement(parseContext);
    case MachineType.RETURN:
      return initReturnStatement(parseContext);
  }
};

const parseSubscripts = (parseContext: ParseContext): Ast => {
  const match = () => {
    switch (parseContext.tokenType()) {
      case MachineType.LEFTCURLYBRACES:
        return initObjectExpression(parseContext);
      case MachineType.LEFTSQUAREBRACKETS:
        return initArrayExpression(parseContext);
      case MachineType.IDENTIFIER:
        const node = normalizationIDENTIFIER(parseContext);
        parseContext.eat(MachineType.IDENTIFIER);
        return node;
    }
  };
  let result = match();
  while (true) {
    var element = parseSubscript(parseContext, result);
    if (element === result) {
      return element;
    }
    result = element;
  }
};

//用于parse一系列的操作符
const parseSubscript = (parseContext: ParseContext, element: Ast) => {
  if (parseContext.eat(MachineType.DOT)) {
    return initMemberExpression(parseContext, element);
  } else if (parseContext.eat(MachineType.LEFTPARENTHESES)) {
    const args: Array<Ast> = [];
    while (!parseContext.eat(MachineType.RIGHTPARENTHESES)) {
      const element = parseExpression(parseContext, {
        functionType: false,
      });
      if (element) {
        args.push(element);
      }
      parseContext.eat(MachineType.COMMA);
    }
    return initCallExpression(element, args);
  }
  return element;
};

const parseMaybeSequence = (children: Array<Ast>) => {
  let node = children[0];
  if (children.length > 1) {
    node = initSequenceExpression(children);
  }
  return initExpressionStatement(node);
};

export const parseExpression = (
  parseContext: ParseContext,
  options = { functionType: true }
): Ast => {
  const maybeExpressionAndStatement = parseExpressionAndStatement(
    parseContext,
    options
  );
  if (maybeExpressionAndStatement) {
    return maybeExpressionAndStatement;
  }
  const result = parseSubscripts(parseContext);
  if (result) {
    return result;
  }
  switch (parseContext.tokenType()) {
    case MachineType.SEMICOLON:
      parseContext.eat(MachineType.SEMICOLON);
      break;
    default:
      parseContext.unexpected();
      break;
  }
  return null;
};

export const parseStatement = (
  parseContext: ParseContext,
  options = { functionType: true }
): Ast => {
  const maybeExpressionAndStatement = parseExpressionAndStatement(
    parseContext,
    options
  );
  if (maybeExpressionAndStatement) {
    return maybeExpressionAndStatement;
  }
  switch (parseContext.currentTokenType) {
    case MachineType.LET:
    case MachineType.VAR:
    case MachineType.CONST:
      return initVariableDeclaration(parseContext);
    case MachineType.SEMICOLON:
      parseContext.eat(MachineType.SEMICOLON);
      break;
    default:
      const children: Array<Ast> = [];
      children.push(parseExpression(parseContext));
      while (parseContext.eat(MachineType.COMMA)) {
        children.push(parseExpression(parseContext));
      }
      return parseMaybeSequence(children);
  }
};
