import { Ast } from "../AstTypes/ast";
import { Identifier } from "../AstTypes/Identifier";
import { Literal } from "../AstTypes/Literal";
import { SequenceExpression } from "../AstTypes/SequenceExpression";
import { composeParse } from "../parse";
import { ParseContext } from "../parseRegister";
import { Token } from "../tokenizer";
import { isSimpleToken, isSymbolToken, isToken } from "../tokensHelps";

export const createSimpleToken = (token: Token | Ast) => {
    if (isToken(token)) {
        if (isSimpleToken(token)) {
            return new Literal(token)
        } else {
            return new Identifier(token)
        }
    }
    return token;
}

export const operatorAstCreate = (token: Token | Ast, context: ParseContext, createWarpAst: (token: Token | Ast) => Ast) => {
    const takeToken = context.getToken();
    //把符号给吃掉
    const operatorSymbol = context.eat(0, 1)[0];
    const nextToken = context.eat(0, 1)[0];
    //这里不想写类型继承了
    const expression = createWarpAst(token) as any;
    //运算符
    expression.operator = operatorSymbol.value;
    if (nextToken) {
        const express = context.walk(nextToken);
        if (!isSymbolToken(nextToken)) {
            expression.right = createSimpleToken(nextToken);
        } else {
            throw new SyntaxError(" Assignment miss right");
        }
        const isDot = takeToken.getRowTokens()[0];
        if (isDot && isSymbolToken(isDot, ",")) {
            if (express) {
                if(express instanceof SequenceExpression){
                    expression.right = express.expressions[0];
                }else{
                    expression.right = express;
                }
            }
            //先吃掉这个逗号
            context.eat(0, 1);
            //吃掉下一个的开头
            //保证和整体迭代一致性
            const nextHead = context.eat(0, 1)[0];
            const sequenceExpression = new SequenceExpression();
            //应为是逗号
            sequenceExpression.expressions.push(expression);
            //是逗号所有直接吃掉当前这一行
            takeToken.whereToken((isSymbol) => {
                return isSymbol && (isSymbol.value != ";" && isSymbol.value != ")")
            });
            const eatToken = context.eat(0, takeToken.getIndex());
            if (nextHead) {
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
            }
            return sequenceExpression;
        }else{
            if (express) {
                if(express instanceof SequenceExpression){
                    expression.right = express.expressions[0];
                }else{
                    expression.right = express;
                }
            }
        }
    }
    return expression;
}
