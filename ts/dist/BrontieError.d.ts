import { Context } from './Context';
declare class BrontieError extends Error {
    isBrontieError: boolean;
    sdk: string;
    code: string;
    ctx: Context;
    status: number;
    get notFound(): boolean;
    constructor(code: string, msg: string, ctx: Context);
}
export { BrontieError };
