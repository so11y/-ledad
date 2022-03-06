import { Ast } from "./ast"
import { FunctionDeclaration } from "./FunctionDeclaration";
import { Identifier } from "./Identifier";

export class ObjectProperty extends Ast {
    key: Identifier;
    methods: boolean = false;
    value: Ast;
    type = "ObjectProperty";

    constructor(key?: Identifier, value?: Ast) {
        super();
        if (key) {
            this.key = key;
        }
        if (value) {
            if(value instanceof FunctionDeclaration){
                this.methods = true;
            }
            this.value = value
        }
    }
}

export class ObjectExpression extends Ast {
    type = "ObjectExpression";
    properties: Array<ObjectProperty> = []
}