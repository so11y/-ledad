import { Ast } from "../AstTypes/ast";
import { composeParse } from "../parse";
import { Identifier } from "../AstTypes/Identifier";
import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";
import { AssignmentExpression } from "../AstTypes/AssignmentExpression";
import { isSimpleToken, isSymbolToken, isToken } from "../tokensHelps";
import { Literal } from "../AstTypes/Literal";
import { SequenceExpression } from "../AstTypes/SequenceExpression";


const createSimpleToken = (token: Token | Ast) => {
    if (isToken(token)) {
        if (isSimpleToken(token)) {
            return new Literal(token)
        } else {
            return new Identifier(token)
        }
    }
    return token;
}

const createCallExpression = (token: Token | Ast) => {
    const assignmentExpression = new AssignmentExpression();
    assignmentExpression.left = createSimpleToken(token);
    return assignmentExpression;
}


export const AssignmentExpressionParse = (token: Token | Ast, context: ParseContext) => {
    const takeToken = context.getToken();
    //把等号给吃掉
    context.eat(0, 1)
    const nextToken = context.eat(0, 1)[0];
    const assignmentExpression = createCallExpression(token);
    if (nextToken) {
        const express = context.walk(nextToken);
        if (express) {
            assignmentExpression.right = express;
        } else {
            if (!isSymbolToken(nextToken)) {
                assignmentExpression.right = createSimpleToken(nextToken);
            } else {
                throw new SyntaxError(" Assignment miss right");
            }
        }
        const isDot = takeToken.getRowTokens()[0];
        if (isSymbolToken(isDot, ",")) {
            //先吃掉这个逗号
            context.eat(0, 1);
            //吃掉下一个的开头
            //保证和整体迭代一致性
            const nextHead = context.eat(0, 1)[0];
            const sequenceExpression = new SequenceExpression();
            //应为是逗号
            sequenceExpression.expressions.push(assignmentExpression);
            //是逗号所有直接吃掉当前这一行
            takeToken.whereToken((isSymbol) => isSymbol.value != ";");
            const eatToken = context.eat(0, takeToken.getIndex());
            //开始递归
            const exAst = composeParse(eatToken).walk(nextHead);
            if (exAst) {
                //SequenceExpression只能有一个
                //把下次递归的解构出来保证只有一个
                if (exAst instanceof SequenceExpression) {
                    sequenceExpression.expressions = [...sequenceExpression.expressions, ...exAst.expressions];
                } else {
                    sequenceExpression.expressions.push(exAst);
                }
            }
            return sequenceExpression;
        }
    }
    return assignmentExpression;
}
