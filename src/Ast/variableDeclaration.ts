import { ParseTransform, TransformContext } from "../parse";
import { Identifier } from "../AstTypes/Identifier";
import { Literal } from "../AstTypes/Literal";
import { VariableDeclarator, VariableDeclaration } from "../AstTypes/VariableDeclaration"
import { Token } from "../tokenizer";
import { createDumbTokens, isSimpleToken, tokensTake, tokenTypeIsEqual } from "../tokensHelps";


const cratedVariableDeclarator = (tokens: Array<Token>, context: TransformContext) => {
    const variabledeclarator = new VariableDeclarator();
    const identifier = new Identifier();
    const tokeToken = tokensTake(tokens);
    const headToken = tokeToken.next();
    identifier.initialize(headToken);
    variabledeclarator.id = identifier;

    let identifierName = tokeToken.next();
    if (!tokenTypeIsEqual(identifierName)) {
        if (headToken.type !== "name") {
            throw new SyntaxError('identifier after need "=" symbol');
        }
    }

    const startLiteral = tokeToken.next();

    if (isSimpleToken(startLiteral)) {
        const literal = new Literal(startLiteral);
        variabledeclarator.init = literal;
    } else {
        tokeToken.prev(2)
        const eatTokens = tokens.slice(tokeToken.getIndex());
        const ObjectAST = context.createContext(eatTokens).walk(startLiteral);
        variabledeclarator.init = ObjectAST;
    }

    return variabledeclarator;
}

const createMultipleVariableDeclarator = (tokens: Array<Token>, context: TransformContext) => {
    //创建哑尾节点,用于最后一次分割。
    tokens.push(createDumbTokens({ type: "symbol", value: "=" }));
    const multiTokens = [];
    for (let fast = 0; fast < tokens.length; fast++) {
        const fastToken = tokens[fast];
        for (let last = fast + 1; last < tokens.length; last++) {
            const lastTokens = tokens[last];
            if (
                lastTokens.type === "symbol" &&
                fastToken.value === lastTokens.value &&
                fastToken.value === "="
            ) {
                multiTokens.push(tokens.slice(fast - 1, last - 1));
                fast = last - 2;
                break;
            }
        }
    }
    return multiTokens.map(v => cratedVariableDeclarator(v, context))
}

export const genVariableDeclaration: ParseTransform = (token, context) => {

    const letAst = new VariableDeclaration();
    const t = context.getToken();

    //寻找分号的下标 , 内部已经修改了下标
    t.whereToken((isSymbol) => isSymbol.value != ";")

    const eatToken = context.eat(0, t.getIndex());
    const newLetAst = createMultipleVariableDeclarator(eatToken, context);

    letAst.kind = token.value;
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