import { MachineType } from "../parse/machineType";

export interface Ast {
  type: string;
}

export interface ParseOptions {
  functionType?: boolean;
  breakCall?: boolean;
}

export interface RegisterType {
  register(key: string, type: MachineType): RegisterType;
  getType(key: string): any;
}
