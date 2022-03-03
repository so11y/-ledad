
import { Token } from "./tokenizer";

export abstract class Ast {
    start: number = 0;
    end: number = 0;
    type: string = null;
}

export interface AstConstructor {
    new(): Ast;
}

interface Context {
    eat: (start: number, end: number) => void;

}

interface KeywordParse {
    kind: string;
    transform: (context: Context) => Ast;
}

export const parse = (tokens: Array<Token>) => {
    const copyTokens = tokens.slice(0);
    const keyWordMap = new Map<string, KeywordParse>();

    const ast = {
        type: "Program",
        body: [] as Ast[]
    }

    const parseContext = {
        eat: (start: number, end: number) => {
            copyTokens.splice(start, end);
        }
    }

    function addParseToken(t: KeywordParse) {
        keyWordMap.set(t.kind, t);
        return this;
    }
    function runParse() {
        while (copyTokens.length) {
            const current = copyTokens.shift();
            if (keyWordMap.has(current.value)) {
                const createAST = keyWordMap.get(current.value).transform(parseContext);
                ast.body.push(createAST);
            }
        }
    }

    return {
        addParseToken,
        runParse
    }
}