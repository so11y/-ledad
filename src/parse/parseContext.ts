import { Ast } from "../types/ast";
import { tokensTake } from "../tokenizer/tokensHelps";

export interface ParseContext {
    getToken(): ReturnType<typeof tokensTake>;
    parse(ast: Array<Ast>): void;
}


