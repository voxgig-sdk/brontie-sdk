// Typed models for the Brontie SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Balance {
  alertAt: number | null
  alertPercent: number
  balance: number
  currency: string
}

export interface BalanceLoadMatch {
  alertAt?: number | null
  alertPercent?: number
  balance?: number
  currency?: string
}

export interface Voucher {
  amount: number
  balanceAfter: number
  expiresAt: string
  idempotencyKey: string
  idempotentReplay: boolean
  message?: string
  mode: string
  product: string
  recipient?: Record<string, any>
  redeemLink: string
  reference: string
  senderName?: string
  voucherToken: string
}

export interface VoucherCreateData {
  amount: number
  balanceAfter: number
  expiresAt: string
  idempotencyKey: string
  idempotentReplay: boolean
  message?: string
  mode: string
  product: string
  recipient?: Record<string, any>
  redeemLink: string
  reference: string
  senderName?: string
  voucherToken: string
}

