<?php
declare(strict_types=1);

// Typed models for the Brontie SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Balance entity data model. */
class Balance
{
    public mixed $alertAt;
    public float $alertPercent;
    public float $balance;
    public string $currency;
}

/** Request payload for Balance#load. */
class BalanceLoadMatch
{
    public mixed $alertAt = null;
    public ?float $alertPercent = null;
    public ?float $balance = null;
    public ?string $currency = null;
}

/** Voucher entity data model. */
class Voucher
{
    public string $idempotencyKey;
    public ?string $message = null;
    public string $product;
    public ?array $recipient = null;
    public ?string $reference = null;
    public ?string $senderName = null;
}

/** Request payload for Voucher#create. */
class VoucherCreateData
{
    public string $idempotencyKey;
    public ?string $message = null;
    public string $product;
    public ?array $recipient = null;
    public ?string $reference = null;
    public ?string $senderName = null;
}

