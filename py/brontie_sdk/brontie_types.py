# Typed models for the Brontie SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Balance(TypedDict):
    alertAt: float | None
    alertPercent: float
    balance: float
    currency: str


class BalanceLoadMatch(TypedDict, total=False):
    alertAt: float | None
    alertPercent: float
    balance: float
    currency: str


class VoucherRequired(TypedDict):
    idempotencyKey: str
    product: str


class Voucher(VoucherRequired, total=False):
    message: str
    recipient: dict
    reference: str
    senderName: str
    voucherToken: str


class VoucherCreateDataRequired(TypedDict):
    idempotencyKey: str
    product: str


class VoucherCreateData(VoucherCreateDataRequired, total=False):
    message: str
    recipient: dict
    reference: str
    senderName: str
    voucherToken: str
