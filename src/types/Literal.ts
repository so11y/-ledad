import { Ast } from "./ast";


export class Literal extends Ast{
    type = "Literal";
    value:string | number
}