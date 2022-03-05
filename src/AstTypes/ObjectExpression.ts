import { Ast } from "./ast"
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
            this.value = value
        }
    }
}

export class ObjectExpression extends Ast {
    type = "ObjectExpression";
    properties: Array<ObjectProperty> = []
}