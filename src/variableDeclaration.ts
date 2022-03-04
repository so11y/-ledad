import { ParseTransform } from "./parse";
import { Identifier, Literal, VariableDeclaration, VariableDeclarator } from "./ast";
import { Token } from "./tokenizer";
import { createDumbTokens, tokensTake } from "./tokensHelps";


const cratedVariableDeclarator = (tokens: Array<Token>) => {
    const variabledeclarator = new VariableDeclarator();
    const identifier = new Identifier();
    const tokeToken = tokensTake(tokens);
    const headToken = tokeToken.next();
    const lastToken = tokeToken.last();

    variabledeclarator.initSequence(headToken.start, lastToken.end)
    variabledeclarator.id = identifier;

    console.log("--");
    let identifierName = tokeToken.next();
    if (identifierName.type !== "name") {
        if (headToken.type !== "name") {
            throw new SyntaxError('identifier SyntaxError error');
        }
        identifierName = tokeToken.prev(2);
    }

    identifier.initialize(identifierName);

    const isBeforeSpace = tokeToken.next();
    if (isBeforeSpace.type != 'space') {
        throw new SyntaxError('identifier before need space');
    }
    const isEqualSign = tokeToken.next();
    if (isEqualSign.value !== "=" && isEqualSign.type !== "name") {
        throw new SyntaxError('identifier after need equalSign');
    }
    const isAfterSpace = tokeToken.next();
    if (isAfterSpace.type != 'space') {
        throw new SyntaxError('identifier after need space');
    }
    const startLiteral = tokeToken.next();
    if (startLiteral.type === "string" || startLiteral.type === "number") {
        const literal = new Literal(startLiteral);
        variabledeclarator.init = literal;
    }

    return variabledeclarator;
}

const createMultipleVariableDeclarator = (tokens: Array<Token>) => {
    const multipTokens = [];
    for (let fast = 0, last = 0; last < tokens.length; last++) {
        const lastValue = tokens[last];
        if (lastValue.type === "symbol" && lastValue.value === ",") {
            multipTokens.push([...tokens.slice(fast, last), createDumbTokens(lastValue)]);
            fast = last + 1;
        }
        if (last === tokens.length - 1) {
            multipTokens.push([...tokens.slice(fast, last), createDumbTokens(lastValue)]);
        }
    }
    return multipTokens.map(v => cratedVariableDeclarator(v))
}

export const genVariableDeclaration: ParseTransform = (token, context) => {
    const letAst = new VariableDeclaration();
    const t = context.getToken();
    const isSpace = t.next();
    const isVariable = t.next();
    if (isSpace.type !== "space") {
        throw new SyntaxError('let after need token type is space');
    }
    if (isVariable.type !== "name") {
        throw new SyntaxError('let after need token type is variable');
    }
    let isEnd = t.next();

    while (isEnd.value != ";") {
        isEnd = t.next();
    }
    const eatToken = context.eat(0, t.getIndex());
    const newLetAst = createMultipleVariableDeclarator(eatToken);
    letAst.kind = token.value;
    letAst.start = token.start;
    letAst.end = newLetAst[newLetAst.length - 1].end;
    letAst.declarations = newLetAst;

    return letAst;
}

export const VariableDeclarationParseLet = {
    kind: "let",
    transform: genVariableDeclaration
}
export const VariableDeclarationParseVar = {
    kind: "var",
    transform: genVariableDeclaration
}
export const VariableDeclarationParseConst = {
    kind: "const",
    transform: genVariableDeclaration
}