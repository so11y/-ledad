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
            if (value instanceof FunctionDeclaration) {
                this.methods = true;
            }
            this.value = value
        }
    }
    _generator() {
        return this.key._generator() + ":" + this.value._generator();
    }
}

export class ObjectExpression extends Ast {
    type = "ObjectExpression";
    properties: Array<ObjectProperty> = []
    _generator() {
        return '{' + this.properties.map(v => v._generator()).join(",") + '}';
    }
}