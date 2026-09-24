import { BrontieEntityBase } from '../BrontieEntityBase';
import type { BrontieSDK } from '../BrontieSDK';
import type { Control } from '../types';
import type { Balance, BalanceLoadMatch } from '../BrontieTypes';
declare class BalanceEntity extends BrontieEntityBase<Balance> {
    constructor(client: BrontieSDK, entopts: any);
    make(this: BalanceEntity): BalanceEntity;
    load(this: any, reqmatch?: BalanceLoadMatch, ctrl?: Control): Promise<BalanceEntity>;
}
export { BalanceEntity };
