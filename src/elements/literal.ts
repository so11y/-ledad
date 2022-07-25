import { Ast } from "../share/types";

export class Literal implements Ast {
  start: number;
  end: number;
  type = "literal";
  value: string;
}

export const initLiteral = (value: string) => {
  const literal = new Literal();
  literal.value = value;
  return literal;
};
