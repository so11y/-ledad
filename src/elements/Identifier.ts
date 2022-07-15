import { Ast } from "../share/types";

export class Identifier implements Ast {
  type = "Identifier";
  name: string;
}

export const initIdentifier = (name: string) => {
  const identifier = new Identifier();
  identifier.name = name;
  return identifier;
};
