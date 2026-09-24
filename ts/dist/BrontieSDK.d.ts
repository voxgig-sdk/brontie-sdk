import { BalanceEntity } from './entity/BalanceEntity';
import { VoucherEntity } from './entity/VoucherEntity';
export type * from './BrontieTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { BrontieEntityBase } from './BrontieEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class BrontieSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Balance(entopts?: Record<string, any>): BalanceEntity;
    Voucher(entopts?: Record<string, any>): VoucherEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): BrontieSDK;
    tester(testopts?: any, sdkopts?: any): BrontieSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof BrontieSDK;
export { stdutil, config, BaseFeature, BrontieEntityBase, BrontieSDK, SDK, };
