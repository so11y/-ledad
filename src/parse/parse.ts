
import { Token } from "../tokenizer/tokenizer";
import { Ast } from "../types/ast";
import { ParseContext } from "./parseContext";
import { tokensTake } from "../tokenizer/tokensHelps";
import { parseToken } from "./parseToken";

/**
 * 引用吃掉
 */
export const composeParse = (tokens: Array<Token>): ParseContext => {
    const parseContext = {
        getToken() {
            return tokensTake(tokens);
        },
        parse(ast: Array<Ast>) {
            while (tokens.length) {
                const ast_ = parseToken(tokens,parseContext);
                if (ast_) {
                    ast.push(ast_);
                }else{
                    //不重要的token,一般是 ',';
                    //可以直接吃掉
                    //用来兜底
                    tokens.shift();
                }
            }
        },
    }
    return parseContext;
}



export const parse = (tokens: Array<Token>) => {
    const ast = {
        type: "Program",
        body: [] as Ast[],
    }
    composeParse(tokens).parse(ast.body)
    return ast
}

