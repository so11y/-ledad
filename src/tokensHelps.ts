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

export const createDumbTokens = (ranks: Partial<Token>): Token => {
    return Object.assign(ranks, { type: "symbol", start: 0, end: 0, value: "=" })
}

export const tokensTake = (tokens: Array<Token>) => {
    let index = 0;
    return {
        getIndex() {
            return index;
        },
        getToken(index:number){
            return tokens[index]
        },
        prev(p?: number) {
            if (p) {
                index -= p
                return tokens[index++];
            }
            return tokens[--index];
        },
        next() {
            return tokens[index++];
        },
        last() {
            return tokens[tokens.length - 1];
        },
        init() {
            index = 0;
        },
        setIndex(i: number) {
            index = i;
        },
        whereToken(whereBack: (token: Token) => boolean) {
            let isEnd = this.next();
            while (whereBack(isEnd)) {
                isEnd = this.next();
            }
            return isEnd || false;
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

export const getTokenTypes = (tokens: Array<Token>, type: string) => {
    return tokens.filter(v => v.type === type);
}
//tokenTypeIsName
export const isNameToken = (token: Token) => {
    return token.type === "name";
}

export const isToken = (token:any):token is Token=>{
    return token.type && (token.value != undefined)
}

export const tokenTypeIsEqual = (token: Token) => {
    return isSymbolToken(token, "=");
}

export const isSymbolToken = (token: Token, value?: string) => {
    if (!value) {
        return token.type === "symbol";
    }
    return token.type === "symbol" && token.value === value;
}

export const isSimpleToken = (token: Token) => {
    return token.type === "string" || token.type === "number";
}

export const isFunctionToken = (token: Token) => {
    return token.type === "name" && token.value === "function";
}

export const parseCanWalk = (token: Token) => {
    return isFunctionToken(token) || ["{", "[",].some((v) => isSymbolToken(token, v))
}

export const isSymbolTokens = (tokens: Token) => {
    return ["{", "[",].some((v) => isSymbolToken(tokens, v))
}