import { Ast } from "./ast";


export class Identifier extends Ast {
    type = 'Identifier';
    name:string;
    constructor(name:string){
        super();
        this.name = name;
    }
}