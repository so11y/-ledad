import { eatRow } from "../tokenizer/tokensHelps";
import { Token } from "../tokenizer/tokenizer";
import { Assert, tokenTypes } from "../tokenizer/types";
import { ParseContext } from "./parseContext";
import { VariableDeclarationAnalyse } from "../types/VariableDeclaration";
import { composeParse } from "./parse";

let i = 0;
export const parseToken = (tokens: Array<Token>, context: ParseContext) => {
    if(i < 10){
        i++;
    }
    if(i >= 5){
        return
    }
    const row = eatRow(tokens);
    if (row) {
        return parseToken(row, composeParse(row));
    }
    if (tokens.length) {
        const assert = Assert.assert(tokens);

        switch (assert) {
            case tokenTypes.VariableDeclaration:
                return VariableDeclarationAnalyse(context);
        }
    }

    return null;
}