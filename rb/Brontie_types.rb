# frozen_string_literal: true

# Typed models for the Brontie SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Balance entity data model.
#
# @!attribute [rw] alertAt
#   @return [Object]
#
# @!attribute [rw] alertPercent
#   @return [Float]
#
# @!attribute [rw] balance
#   @return [Float]
#
# @!attribute [rw] currency
#   @return [String]
Balance = Struct.new(
  :alertAt,
  :alertPercent,
  :balance,
  :currency,
  keyword_init: true
)

# Request payload for Balance#load.
#
# @!attribute [rw] alertAt
#   @return [Object, nil]
#
# @!attribute [rw] alertPercent
#   @return [Float, nil]
#
# @!attribute [rw] balance
#   @return [Float, nil]
#
# @!attribute [rw] currency
#   @return [String, nil]
BalanceLoadMatch = Struct.new(
  :alertAt,
  :alertPercent,
  :balance,
  :currency,
  keyword_init: true
)

# Voucher entity data model.
#
# @!attribute [rw] amount
#   @return [Float]
#
# @!attribute [rw] balanceAfter
#   @return [Float]
#
# @!attribute [rw] expiresAt
#   @return [String]
#
# @!attribute [rw] idempotencyKey
#   @return [String]
#
# @!attribute [rw] idempotentReplay
#   @return [Boolean]
#
# @!attribute [rw] message
#   @return [String, nil]
#
# @!attribute [rw] mode
#   @return [String]
#
# @!attribute [rw] product
#   @return [String]
#
# @!attribute [rw] recipient
#   @return [Hash, nil]
#
# @!attribute [rw] redeemLink
#   @return [String]
#
# @!attribute [rw] reference
#   @return [String]
#
# @!attribute [rw] senderName
#   @return [String, nil]
#
# @!attribute [rw] voucherToken
#   @return [String]
Voucher = Struct.new(
  :amount,
  :balanceAfter,
  :expiresAt,
  :idempotencyKey,
  :idempotentReplay,
  :message,
  :mode,
  :product,
  :recipient,
  :redeemLink,
  :reference,
  :senderName,
  :voucherToken,
  keyword_init: true
)

# Request payload for Voucher#create.
#
# @!attribute [rw] amount
#   @return [Float]
#
# @!attribute [rw] balanceAfter
#   @return [Float]
#
# @!attribute [rw] expiresAt
#   @return [String]
#
# @!attribute [rw] idempotencyKey
#   @return [String]
#
# @!attribute [rw] idempotentReplay
#   @return [Boolean]
#
# @!attribute [rw] message
#   @return [String, nil]
#
# @!attribute [rw] mode
#   @return [String]
#
# @!attribute [rw] product
#   @return [String]
#
# @!attribute [rw] recipient
#   @return [Hash, nil]
#
# @!attribute [rw] redeemLink
#   @return [String]
#
# @!attribute [rw] reference
#   @return [String]
#
# @!attribute [rw] senderName
#   @return [String, nil]
#
# @!attribute [rw] voucherToken
#   @return [String]
VoucherCreateData = Struct.new(
  :amount,
  :balanceAfter,
  :expiresAt,
  :idempotencyKey,
  :idempotentReplay,
  :message,
  :mode,
  :product,
  :recipient,
  :redeemLink,
  :reference,
  :senderName,
  :voucherToken,
  keyword_init: true
)

