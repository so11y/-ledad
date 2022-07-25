import { initExpressionStatement } from "../elements/expressionStatement";
import { initSequenceExpression } from "../elements/sequence";
import { initIdentifier } from "../elements/Identifier";
import { Ast, ParseOptions } from "../share/types";
import { isLogical, isOperation, MachineType, Operation } from "./machineType";
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
import { initBinaryExpression } from "../elements/binary";
import { initLogicalExpression } from "../elements/logicalExpression";
import { initWhileStatement } from "../elements/whileStatement";
import { initBreakStatement } from "../elements/breakStatement";
import { initAwaitExpression } from "../elements/await";
import { initImportDeclaration } from "../elements/ImportDeclaration";
import { initExportNamedDeclaration } from "../elements/export";

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
  options: ParseOptions
): Ast => {
  switch (parseContext.tokenType()) {
    case MachineType.ASYNC:
    case MachineType.FUNCTION:
      return initFunctionDeclaration(parseContext, options.functionType);
    case MachineType.IF:
      return initIfStatement(parseContext);
    case MachineType.RETURN:
      return initReturnStatement(parseContext);
    case MachineType.WHILE:
      return initWhileStatement(parseContext);
    case MachineType.BREAK:
      return initBreakStatement(parseContext);
    case MachineType.AWAIT:
      return initAwaitExpression(parseContext);
    case MachineType.IMPORT:
      return initImportDeclaration(parseContext);
  }
};

const parseSubscripts = (
  parseContext: ParseContext,
  options: ParseOptions
): Ast => {
  const match = () => {
    switch (parseContext.tokenType()) {
      case MachineType.LEFTCURLYBRACES:
        return initObjectExpression(parseContext);
      case MachineType.LEFTSQUAREBRACKETS:
        return initArrayExpression(parseContext);
      case MachineType.IDENTIFIER:
        const node = normalizationIDENTIFIER(parseContext);
        node.start = parseContext.currentToken.start;
        node.end = parseContext.currentToken.end;
        parseContext.eat(MachineType.IDENTIFIER);
        return node;
    }
  };
  let result = match();
  while (true) {
    var element = parseSubscript(parseContext, result, options);
    if (element === result) {
      return element;
    }
    result = element;
  }
};

//用于parse 后缀符号
const parseExpOp = (parseContext: ParseContext, left: Ast, prev = -1): Ast => {
  if (!parseContext.currentToken) {
    return left;
  }
  const opType = parseContext.currentTokenType;
  const [op, ll] = [
    isOperation(parseContext.currentToken.value),
    isLogical(parseContext.currentToken.value),
  ];
  //用于优先级判断
  //precedence 大于prev 那么就会深度去解析
  //a && b > c;
  //因为这里要优先把 (b > c) 树先组织好
  //如果正常的不存在交错的话,就是解析流程
  let precedence = (op ? 2 : false || ll ? 1 : false) || -1;
  if (precedence <= prev) {
    return left;
  }
  if (op || ll) {
    const initFun = op ? initBinaryExpression : initLogicalExpression;
    parseContext.expect(parseContext.currentTokenType);
    const right = parseExpOp(
      parseContext,
      parseMaybeUnary(parseContext),
      precedence
    );
    if (!right) {
      parseContext.unexpected();
    }
    const binaryExpression = initFun(left, right, opType as any);
    return parseExpOp(parseContext, binaryExpression);
  }

  return left;
};

//用于parse一系列后缀的操作符
const parseSubscript = (
  parseContext: ParseContext,
  element: Ast,
  options: ParseOptions
) => {
  if (parseContext.eat(MachineType.DOT)) {
    return initMemberExpression(parseContext, element);
  } else if (
    !options.breakCall &&
    parseContext.eat(MachineType.LEFTPARENTHESES)
  ) {
    const args: Array<Ast> = [];
    while (!parseContext.eat(MachineType.RIGHTPARENTHESES)) {
      const element = parseExpression(parseContext, {
        ...options,
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

export const parseMaybeUnary = (
  parseContext: ParseContext,
  options: ParseOptions = { functionType: true, breakCall: false }
) => {
  const maybeExpressionAndStatement = parseExpressionAndStatement(
    parseContext,
    options
  );
  if (maybeExpressionAndStatement) {
    return maybeExpressionAndStatement;
  }
  const result = parseSubscripts(parseContext, options);
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
};

export const parseExpression = (
  parseContext: ParseContext,
  options: ParseOptions = { functionType: true, breakCall: false }
): Ast => {
  const element = parseMaybeUnary(parseContext, options);
  if (element) {
    return parseExpOp(parseContext, element);
  }
  return null;
};

export const parseStatement = (
  parseContext: ParseContext,
  options: ParseOptions = { functionType: true, breakCall: false }
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
    case MachineType.EXPORT:
      return initExportNamedDeclaration(parseContext);
    default:
      const children: Array<Ast> = [];
      children.push(parseExpression(parseContext, options));
      while (parseContext.eat(MachineType.COMMA)) {
        children.push(parseExpression(parseContext, options));
      }
      return parseMaybeSequence(children);
  }
};
