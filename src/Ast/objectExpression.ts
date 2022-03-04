
import { ObjectExpression } from "../AstTypes/ObjectExpression";
import { ParseTransform } from "../parse";

const genObjectExpression: ParseTransform = (token, context) => {
    const objectAst = new ObjectExpression();

    return objectAst;
}
export const ObjectExpressionParse = {
    kind: "{",
    transform: genObjectExpression
}