import { Ast } from "../share/types";

export class Literal implements Ast {
  type = "literal";
  value: string;
}

export const initLiteral = (value: string) => {
  const literal = new Literal();
  literal.value = value;
  return literal;
};
