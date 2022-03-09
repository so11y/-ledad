
import { isSymbolToken } from "../tokensHelps";
import { MemberExpression } from "../AstTypes/MemberExpression";
import { composeParse } from "../parse";
import { ParseContext,ParseTransform } from "../parseRegister";
import { Token } from "../tokenizer";
import { Identifier } from "../AstTypes/Identifier";


const createMemberExpression = (token: Token, tokens: Array<Token>) => {
    const memberExpression = new MemberExpression();
    memberExpression.property = new Identifier(tokens.pop());
    //消耗掉最后一个 '.' 符号
    tokens.pop()
    if (tokens.length > 1) {
        memberExpression.object = composeParse(tokens).walk(token);
    } else {
        memberExpression.object = new Identifier(token);
    }

    return memberExpression;
}


export const MemberExpressionParse: ParseTransform = (token: Token, context: ParseContext) => {
    const tokeToken = context.getToken();
    tokeToken.whereToken(v => {
        if (v && isSymbolToken(v, ".")) {
            tokeToken.next();
            return true;
        }
        return false;
    })
    //获取当前找到的下标最后一项,因为内部会在多调用一次next
    //所以下标减1
    const lastToKen = tokeToken.getToken(tokeToken.getIndex() - 1) //tokeToken.last();
    //如果最后一项是符号
    //那么不能把这个符号给吃掉
    if (lastToKen && isSymbolToken(lastToKen)) {
        tokeToken.prev(2);
    }
    const eatTokens = context.eat(0, tokeToken.getIndex());
    //这个token传入当做哑token使用,因为下一次可能
    const memberExpression = createMemberExpression(token, eatTokens);

    //如果最后一项存在
    if (lastToKen) {
        //判断是否能继续语法
        const express = context.walkExpression(memberExpression);
        //如果能则输出
        //这里将已经会形成上下级
        if (express) {
            return express;
        }
    }

    return memberExpression;
}

