import { Ast } from "../share/types";

class Literal implements Ast {
  type = "literal";
  value: string;
}

export const initLiteral = (value: string) => {
  const literal = new Literal();
  literal.value = value;
  return literal;
};
