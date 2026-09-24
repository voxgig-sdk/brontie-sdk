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
    idempotencyKey: string;
    message?: string;
    product: string;
    recipient?: Record<string, any>;
    reference?: string;
    senderName?: string;
}
export interface VoucherCreateData {
    idempotencyKey: string;
    message?: string;
    product: string;
    recipient?: Record<string, any>;
    reference?: string;
    senderName?: string;
}
