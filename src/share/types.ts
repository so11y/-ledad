export const isObject = (v: unknown): v is Record<string, any> => {
    return typeof v === "object";
}

export const isString = (v:unknown):v is string=>{
    return typeof v === "string";
}
export const isNumber = (v:unknown):v is number=>{
    return typeof v === "number";
}