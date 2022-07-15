export enum MachineType {
  EOF = "eof", // token end
  LET = "let", //let 关键字
  VAR = "var", //var 关键字
  CONST = "const", //count 关键字
  EQUALLING = "=", //等号到关键字
  EQUALLINGEND = "=", //等号到关键字结束
  SEMICOLON = ";", //分号关键字
  LEFTCURLYBRACES = "{", //左括号
  RIGHTCURLYBRACES = "}", //右括号
  IDENTIFIER = "identifier", //标识符
  COMMA = ",", //逗号
  COLON = ":", //冒号
  LEFTSQUAREBRACKETS = "[", //左中括号
  RIGHTSQUAREBRACKETS = "]", //右中括号
  FUNCTION = "function", //function 关键字
  LEFTPARENTHESES = "(", //左圆括号
  RIGHTPARENTHESES = ")", //右圆括号
  IF = "if", //if关键字
  RETURN = "return",// return 关键字
  DOT = ".",//点
}

export type Variable = MachineType.LET | MachineType.CONST | MachineType.VAR;
