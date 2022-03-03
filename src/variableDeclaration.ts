import { Ast, ParseTransform } from "./parse";
import { Token } from "./tokenizer";

class Identifier {
    type = "Identifier";
    start: number;
    end: number;
    name: string;
}

class Literal {
    type = "Literal";
    start: number;
    end: number;
    value: string | number;

}

class VariableDeclarator {
    type = "VariableDeclarator";
    start: number;
    end: number;
    id: Identifier;
    init: Literal;
}
export class VariableDeclaration extends Ast {
    type = "VariableDeclaration";
    kind: string;
    declarations: VariableDeclarator[]
}

const cratedVariableDeclarator = (tokens: Array<Token>) => {
    const variabledeclarator = new VariableDeclarator();
    const identifier = new Identifier();
    const headToken = tokens.shift();
    const lastToken = tokens.pop();
    variabledeclarator.start = headToken.start;
    variabledeclarator.end = lastToken.end;
    variabledeclarator.id = identifier;

    const identifierName = tokens.shift();
    if (identifierName.type !== "name") {
        throw new SyntaxError('identifier SyntaxError error');
    }

    identifier.name = identifierName.value;
    identifier.start = identifierName.start;
    identifier.end = identifierName.end;


    return variabledeclarator;
}


export const genLetVariableDeclaration: ParseTransform = (token, context) => {
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
    const newletAst = cratedVariableDeclarator(eatToken);
    letAst.kind = "let";
    letAst.start = token.start;
    letAst.end = newletAst.end;
    letAst.declarations = [newletAst];

    return letAst;
}

export const VariableDeclarationParse = {
    kind: "let",
    transform: genLetVariableDeclaration
}