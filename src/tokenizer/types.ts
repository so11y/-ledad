import { Token } from "./tokenizer";
import { isNumber, isObject, isString } from "../share/types";

export const isHaveToken = (token: Token): boolean => {
    return token !== null && token !== undefined;
}

export const isSymbol = (token: Token, value?: string) => {
    const have = isHaveToken(token) && token.type === "symbol";
    if (value && have) {
        return token.value === value;
    }
    return have;
}

export const isToken = (token: unknown): token is Token => {
    return isHaveToken(token as any) && isObject(token) && token.type && token.value;
}

export enum tokenTypes {
    VariableDeclaration = "VariableDeclaration",
    Identifier = "Identifier",
    Literal = "Literal"
}


export class Assert {
    /**
     * 按照优先级决定类型
     */
    static assert(tokens: Array<Token>) {
        //变量声明关键字
        if (Assert.isVariableDeclaration(tokens)) {
            return tokenTypes.VariableDeclaration;
        }
        //普通名称
        // a = 10;
        if(Assert.isIdentifier(tokens)){
            return tokenTypes.Identifier;
        }
        //string 或者 number
        if(Assert.isIdentifier(tokens)){
            return tokenTypes.Literal;
        }
    }
    static isVariableDeclaration(tokens: Array<Token>) {
        const head = tokens[0];
        const keyword = ["let", "var", "const"];
        return keyword.some(v => head.value === v)
    }
    static isIdentifier(tokens: Array<Token>) {
        const head = tokens[0];
        return isToken(head) && head.type === "name"
    }
    static isLiteral(tokens: Array<Token>) {
        const head = tokens[0]
        return isToken(head) && (isString(head.value) || isNumber(head.value));
    }

}
