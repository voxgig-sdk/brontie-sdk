-- Typed models for the Brontie SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Balance
---@field alertAt number|nil
---@field alertPercent number
---@field balance number
---@field currency string

---@class BalanceLoadMatch
---@field alertAt? number|nil
---@field alertPercent? number
---@field balance? number
---@field currency? string

---@class Voucher
---@field idempotencyKey string
---@field message? string
---@field product string
---@field recipient? table
---@field reference? string
---@field senderName? string
---@field voucherToken? string

---@class VoucherCreateData
---@field idempotencyKey string
---@field message? string
---@field product string
---@field recipient? table
---@field reference? string
---@field senderName? string
---@field voucherToken? string

local M = {}

return M
