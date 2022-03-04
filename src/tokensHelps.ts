import { Token } from "./tokenizer";

interface DotSymbol {
    startSymbol: string;
    endSymbol: string;
}
export const TokenParseErrors = {
    startNotFind: Symbol("startNotFind"),
    endNotFind: Symbol("endNotFind")
}
export class TokenParseError extends SyntaxError {
    constructor(public errorCode: Symbol) {
        super("");
    }
}

export const createDumbTokens = (ranks: Pick<Token, "start" | "end">): Token => {
    return {
        type: "space",
        value: " ",
        ...ranks
    }
}

export const tokensTake = (tokens: Array<Token>) => {
    let index = 0;
    return {
        getIndex() {
            return index;
        },
        prev() {
            return tokens[--index];
        },
        next() {
            return tokens[index++];
        },
        last() {
            return tokens[tokens.length - 1];
        },
        init(){
            index = 0 ;
        }
    }
}

export const dotTakeSection = (dot: DotSymbol, tokens: ReturnType<typeof tokensTake>) => {
    const stack = [];
    const startIndex = tokens.getIndex();
    let current = tokens.next();
    if (current.value !== dot.startSymbol) {
        throw new TokenParseError(TokenParseErrors.startNotFind);
    }
    stack.push(current);
    while (current) {
        current = tokens.next();
        if (current.value === dot.startSymbol) {
            stack.push(current);
        } else if (current.value === dot.endSymbol) {
            stack.shift();
            if (stack.length === 0) {
                break;
            }
        }
    }
    if (stack.length || current.value != dot.endSymbol) {
        throw new TokenParseError(TokenParseErrors.endNotFind);
    }
    return [startIndex, tokens.getIndex()];
}

export const getTokenTypes = (tokens:Array<Token>,type:string)=>{
    return tokens.filter(v=>v.type === type);
}