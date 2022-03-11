import { Token } from "./tokenizer";
import { isSymbol } from "./types";

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

export const tokensTake = (tokens: Array<Token>) => {
    let index = 0;
    return {
        eat: (start: number, end: number) => {
            return tokens.splice(start, end);
        },
        getRowTokens() {
            return tokens;
        },
        getIndex() {
            return index;
        },
        getToken(index: number) {
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
            while (isEnd && whereBack(isEnd)) {
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


export const eatRow = (tokens: Array<Token>) => {
    const takeToken = tokensTake(tokens);
    const isSemicolon = takeToken.whereToken((v) => !isSymbol(v, ";"));
    if(isSemicolon && isSymbol(isSemicolon,";")){
        const eat = takeToken.eat(0,takeToken.getIndex());
        //丢弃最后一个分号
        eat.pop();
        return eat;
    }
    return null;
}