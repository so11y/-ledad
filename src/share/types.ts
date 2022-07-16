export interface Ast {
  type: string;
}

export interface ParseOptions {
  functionType?: boolean;
  breakCall?: boolean;
}
