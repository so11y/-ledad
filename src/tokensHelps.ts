import { Token } from "./tokenizer";

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
        }
    }
}

