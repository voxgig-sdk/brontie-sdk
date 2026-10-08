export interface Balance {
    alertAt: number | null;
    alertPercent: number;
    balance: number;
    currency: string;
}
export interface BalanceLoadMatch {
    alertAt?: number | null;
    alertPercent?: number;
    balance?: number;
    currency?: string;
}
export interface Voucher {
    amount: number;
    balanceAfter: number;
    expiresAt: string;
    idempotencyKey: string;
    idempotentReplay: boolean;
    message?: string;
    mode: string;
    product: string;
    recipient?: Record<string, any>;
    redeemLink: string;
    reference: string;
    senderName?: string;
    voucherToken: string;
}
export interface VoucherCreateData {
    amount: number;
    balanceAfter: number;
    expiresAt: string;
    idempotencyKey: string;
    idempotentReplay: boolean;
    message?: string;
    mode: string;
    product: string;
    recipient?: Record<string, any>;
    redeemLink: string;
    reference: string;
    senderName?: string;
    voucherToken: string;
}
