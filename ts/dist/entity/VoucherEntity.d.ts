import { BrontieEntityBase } from '../BrontieEntityBase';
import type { BrontieSDK } from '../BrontieSDK';
import type { Control } from '../types';
import type { Voucher, VoucherCreateData } from '../BrontieTypes';
declare class VoucherEntity extends BrontieEntityBase<Voucher> {
    constructor(client: BrontieSDK, entopts: any);
    make(this: VoucherEntity): VoucherEntity;
    create(this: any, reqdata?: VoucherCreateData, ctrl?: Control): Promise<VoucherEntity>;
}
export { VoucherEntity };
