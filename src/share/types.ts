import { MachineType } from "../parse/machineType";

export class Ast {
  type: string;
  start: number;
  end: number;
}

export interface ParseOptions {
  functionType?: boolean;
  breakCall?: boolean;
}

export interface RegisterType {
  register(key: string, type: MachineType): RegisterType;
  getType(key: string): any;
}
