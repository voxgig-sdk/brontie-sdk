import { test } from 'node:test'
import { SDK } from '..'
import { runLiveScenarios } from './live-scenarios'
import { loadEnvLocal } from './utility'
loadEnvLocal(__dirname + '/../.env.local')
test('live operation coverage', { skip: process.env.BRONTIE_TEST_LIVE !== 'TRUE' }, async () => {
  await runLiveScenarios(SDK, [
  {
    "entity": "balance",
    "accessor": "Balance",
    "op": "load",
    "id": "GET /api/v1/balance",
    "contractVersion": 1,
    "kind": "http",
    "path": "/api/v1/balance",
    "method": "GET",
    "rename": {},
    "args": {},
    "facts": {
      "live": {
        "assert": {
          "equal": {
            "currency": "EUR"
          }
        },
        "auth": "account",
        "id": "balance",
        "retention": "Read-only; creates nothing."
      },
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "securitySource": "definition",
      "responses": {
        "200": {
          "description": "Current balance.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "balance",
                  "currency",
                  "alertPercent",
                  "alertAt"
                ],
                "properties": {
                  "balance": {
                    "key$": "balance",
                    "type": "number"
                  },
                  "currency": {
                    "const": "EUR",
                    "key$": "currency",
                    "type": "string"
                  },
                  "alertPercent": {
                    "description": "Percentage of the most recent top-up at which the low-balance\nthreshold sits. Always present; defaults to 20.\n",
                    "key$": "alertPercent",
                    "type": "number"
                  },
                  "alertAt": {
                    "description": "The threshold resolved to a euro figure: `lastTopUp × alertPercent`.\n`null` until the first top-up has been made, because before then\nthere is nothing for the percentage to be a percentage of.\n",
                    "key$": "alertAt",
                    "type": [
                      "number",
                      "null"
                    ]
                  }
                },
                "x-ref": "#/components/schemas/Balance",
                "index$": 0
              },
              "examples": {
                "afterTopUp": {
                  "summary": "After at least one top-up",
                  "value": {
                    "balance": 245,
                    "currency": "EUR",
                    "alertPercent": 30,
                    "alertAt": 150
                  }
                },
                "beforeFirstTopUp": {
                  "summary": "Before any top-up — alertAt is null",
                  "value": {
                    "balance": 0,
                    "currency": "EUR",
                    "alertPercent": 30,
                    "alertAt": null
                  }
                }
              }
            }
          }
        },
        "401": {
          "description": "Key missing, malformed, revoked or unknown, or a key whose prefix does\nnot match the mode it was issued in.\n",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "unauthorized": {
                  "value": {
                    "code": "unauthorized",
                    "error": "Invalid API key"
                  }
                }
              }
            }
          },
          "x-ref": "#/components/responses/Unauthorized"
        },
        "403": {
          "description": "The key is valid but the call is not permitted: either the key lacks\nthe scope for this endpoint (`vouchers:create` or `balance:read`), or\nthe partner account has been deactivated.\n",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "missingScope": {
                  "value": {
                    "code": "forbidden",
                    "error": "This API key is missing the \"vouchers:create\" scope"
                  }
                },
                "inactivePartner": {
                  "value": {
                    "code": "forbidden",
                    "error": "This partner account is not active"
                  }
                }
              }
            }
          },
          "x-ref": "#/components/responses/Forbidden"
        },
        "429": {
          "description": "Rate limited. Honour `Retry-After`. Limits are per key with separate\ncounters for test and live, so a test key cannot exhaust a live budget.\nDefault 120 requests per minute, burst 20 per second, adjustable per\npartner without a deploy.\n",
          "headers": {
            "Retry-After": {
              "schema": {
                "type": "integer",
                "enum": [
                  1,
                  60
                ]
              },
              "description": "Seconds to wait before retrying. 1 when the per-second burst limit\nwas hit, 60 when the per-minute limit was hit.\n"
            }
          },
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "rateLimited": {
                  "value": {
                    "code": "rate_limited",
                    "error": "Rate limit exceeded — more than 20 requests in one second"
                  }
                }
              }
            }
          },
          "x-ref": "#/components/responses/RateLimited"
        }
      }
    },
    "reachable": true
  },
  {
    "entity": "voucher",
    "accessor": "Voucher",
    "op": "create",
    "id": "POST /api/v1/vouchers",
    "contractVersion": 1,
    "kind": "http",
    "path": "/api/v1/vouchers",
    "method": "POST",
    "rename": {},
    "args": {},
    "facts": {
      "live": {
        "auth": "account",
        "excluded": "Issues a permanent voucher; no delete or refund path exists",
        "id": "voucher-create"
      },
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "securitySource": "definition",
      "responses": {
        "200": {
          "description": "Idempotent replay. The original voucher for this key, not charged\nagain.\n\n# VERIFIED: balanceAfter on a replay is the balance NOW, not the\n# balance after the original debit.\nNote that `balanceAfter` in a replay is your balance at the time of\nthe replay, not the balance recorded when the voucher was first\nissued. If other vouchers have been issued since, it will differ\nfrom the 201 you originally received.\n",
          "content": {
            "application/json": {
              "schema": {
                "allOf": [
                  {
                    "type": "object",
                    "required": [
                      "voucherToken",
                      "redeemLink",
                      "product",
                      "amount",
                      "expiresAt",
                      "balanceAfter",
                      "reference",
                      "mode"
                    ],
                    "properties": {
                      "voucherToken": {
                        "type": "string",
                        "description": "Opaque voucher identifier. Test-mode tokens begin with `test_`.\n"
                      },
                      "redeemLink": {
                        "type": "string",
                        "format": "uri",
                        "description": "The only field you need to keep. Surface this to the recipient.\nLive links are under `/brontie-coffee/`; test links are under\n`/api-sandbox/voucher/` and open a page stating the voucher cannot\nbe redeemed.\n"
                      },
                      "product": {
                        "type": "string",
                        "enum": [
                          "coffee",
                          "coffee_and_cake"
                        ],
                        "description": "`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00. Prices are fixed\nper product, not negotiated per partner.\n",
                        "x-ref": "#/components/schemas/Product"
                      },
                      "amount": {
                        "type": "number",
                        "description": "Amount in EUR debited from the balance."
                      },
                      "expiresAt": {
                        "type": "string",
                        "format": "date-time",
                        "description": "Five years from issue."
                      },
                      "balanceAfter": {
                        "type": "number",
                        "description": "On a 201, the balance after this debit. For test keys nothing is\ndebited, so this is the untouched balance. On a 200 replay, see the\nnote on that response.\n"
                      },
                      "reference": {
                        "type": "string",
                        "description": "Always present. Your `reference` echoed back unchanged, or an empty\nstring if you did not supply one.\n"
                      },
                      "mode": {
                        "type": "string",
                        "enum": [
                          "live",
                          "test"
                        ],
                        "description": "Derived from the API key prefix. A `test` voucher is not redeemable and\nits link opens a page stating so.\n",
                        "x-ref": "#/components/schemas/Mode"
                      }
                    },
                    "x-ref": "#/components/schemas/Voucher"
                  },
                  {
                    "type": "object",
                    "required": [
                      "idempotentReplay"
                    ],
                    "properties": {
                      "idempotentReplay": {
                        "type": "boolean",
                        "const": true
                      }
                    }
                  }
                ],
                "index$": 0
              },
              "examples": {
                "replay": {
                  "value": {
                    "voucherToken": "K6Ab9XUX1OYx",
                    "redeemLink": "https://www.brontie.ie/brontie-coffee/K6Ab9XUX1OYx",
                    "product": "coffee",
                    "amount": 5,
                    "expiresAt": "2031-09-06T00:00:00.000Z",
                    "balanceAfter": 240,
                    "reference": "alulu-learner-8842",
                    "mode": "live",
                    "idempotentReplay": true
                  }
                }
              }
            }
          }
        },
        "201": {
          "description": "Voucher issued and balance debited.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "voucherToken",
                  "redeemLink",
                  "product",
                  "amount",
                  "expiresAt",
                  "balanceAfter",
                  "reference",
                  "mode"
                ],
                "properties": {
                  "voucherToken": {
                    "type": "string",
                    "description": "Opaque voucher identifier. Test-mode tokens begin with `test_`.\n"
                  },
                  "redeemLink": {
                    "type": "string",
                    "format": "uri",
                    "description": "The only field you need to keep. Surface this to the recipient.\nLive links are under `/brontie-coffee/`; test links are under\n`/api-sandbox/voucher/` and open a page stating the voucher cannot\nbe redeemed.\n"
                  },
                  "product": {
                    "type": "string",
                    "enum": [
                      "coffee",
                      "coffee_and_cake"
                    ],
                    "description": "`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00. Prices are fixed\nper product, not negotiated per partner.\n",
                    "x-ref": "#/components/schemas/Product"
                  },
                  "amount": {
                    "type": "number",
                    "description": "Amount in EUR debited from the balance."
                  },
                  "expiresAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Five years from issue."
                  },
                  "balanceAfter": {
                    "type": "number",
                    "description": "On a 201, the balance after this debit. For test keys nothing is\ndebited, so this is the untouched balance. On a 200 replay, see the\nnote on that response.\n"
                  },
                  "reference": {
                    "type": "string",
                    "description": "Always present. Your `reference` echoed back unchanged, or an empty\nstring if you did not supply one.\n"
                  },
                  "mode": {
                    "type": "string",
                    "enum": [
                      "live",
                      "test"
                    ],
                    "description": "Derived from the API key prefix. A `test` voucher is not redeemable and\nits link opens a page stating so.\n",
                    "x-ref": "#/components/schemas/Mode"
                  }
                },
                "x-ref": "#/components/schemas/Voucher"
              },
              "examples": {
                "issued": {
                  "value": {
                    "voucherToken": "K6Ab9XUX1OYx",
                    "redeemLink": "https://www.brontie.ie/brontie-coffee/K6Ab9XUX1OYx",
                    "product": "coffee",
                    "amount": 5,
                    "expiresAt": "2031-09-06T00:00:00.000Z",
                    "balanceAfter": 245,
                    "reference": "alulu-learner-8842",
                    "mode": "live"
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Malformed body or validation failed. Four codes, one per cause.\n",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "invalidJson": {
                  "summary": "Body is not valid JSON",
                  "value": {
                    "code": "invalid_json",
                    "error": "Request body must be valid JSON"
                  }
                },
                "invalidProduct": {
                  "value": {
                    "code": "invalid_product",
                    "error": "product must be \"coffee\" or \"coffee_and_cake\""
                  }
                },
                "missingIdempotencyKey": {
                  "summary": "Absent, not a string, or empty after trimming",
                  "value": {
                    "code": "missing_idempotency_key",
                    "error": "idempotencyKey is required"
                  }
                },
                "invalidIdempotencyKey": {
                  "summary": "Longer than 200 characters after trimming",
                  "value": {
                    "code": "invalid_idempotency_key",
                    "error": "idempotencyKey must be 200 characters or fewer"
                  }
                }
              }
            }
          }
        },
        "401": {
          "description": "Key missing, malformed, revoked or unknown, or a key whose prefix does\nnot match the mode it was issued in.\n",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "unauthorized": {
                  "value": {
                    "code": "unauthorized",
                    "error": "Invalid API key"
                  }
                }
              }
            }
          },
          "x-ref": "#/components/responses/Unauthorized"
        },
        "402": {
          "description": "Insufficient balance. Nothing issued, nothing charged. Live mode\nonly: this response cannot occur for a test key.\n",
          "content": {
            "application/json": {
              "schema": {
                "allOf": [
                  {
                    "type": "object",
                    "required": [
                      "code",
                      "error"
                    ],
                    "properties": {
                      "code": {
                        "type": "string",
                        "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                        "enum": [
                          "invalid_json",
                          "invalid_product",
                          "missing_idempotency_key",
                          "invalid_idempotency_key",
                          "unauthorized",
                          "forbidden",
                          "insufficient_balance",
                          "issue_in_progress",
                          "issue_stuck",
                          "rate_limited",
                          "internal_error"
                        ]
                      },
                      "error": {
                        "type": "string",
                        "description": "Human-readable message. Wording may change."
                      }
                    },
                    "x-ref": "#/components/schemas/Error"
                  },
                  {
                    "type": "object",
                    "required": [
                      "balance",
                      "required",
                      "currency",
                      "topUpUrl"
                    ],
                    "properties": {
                      "balance": {
                        "type": "number",
                        "description": "Your balance at the moment of the request."
                      },
                      "required": {
                        "type": "number",
                        "description": "The product amount that could not be debited."
                      },
                      "currency": {
                        "type": "string",
                        "const": "EUR"
                      },
                      "topUpUrl": {
                        "type": "string",
                        "format": "uri",
                        "description": "A mailto: link to Brontie, prefilled with the partner name.\nSelf-service top-up is not built yet, so this does not open a\npage — it opens an email. Balances are credited by arrangement\nuntil it does.\n"
                      }
                    }
                  }
                ],
                "x-ref": "#/components/schemas/InsufficientBalanceError"
              },
              "examples": {
                "outOfFunds": {
                  "value": {
                    "code": "insufficient_balance",
                    "error": "Insufficient balance to issue this voucher",
                    "balance": 3,
                    "required": 5,
                    "currency": "EUR",
                    "topUpUrl": "mailto:hello@brontie.ie?subject=Top-up%20request%20%E2%80%94%20Alulu"
                  }
                }
              }
            }
          }
        },
        "403": {
          "description": "The key is valid but the call is not permitted: either the key lacks\nthe scope for this endpoint (`vouchers:create` or `balance:read`), or\nthe partner account has been deactivated.\n",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "missingScope": {
                  "value": {
                    "code": "forbidden",
                    "error": "This API key is missing the \"vouchers:create\" scope"
                  }
                },
                "inactivePartner": {
                  "value": {
                    "code": "forbidden",
                    "error": "This partner account is not active"
                  }
                }
              }
            }
          },
          "x-ref": "#/components/responses/Forbidden"
        },
        "409": {
          "description": "Two distinct cases, separated by `code`. Branch on the code, not on\nthe status.\n\n`issue_in_progress`: a request with this key is genuinely in\nflight. Retry with backoff and you will receive the original\nvoucher. Occurs in both modes.\n\n`issue_stuck`: a claim for this key has been pending for more than\nfive minutes, meaning an earlier attempt died mid-issue. In live\nmode this is not resolved automatically, because money may already\nhave moved and only a human can reconcile it safely. Brontie is\nalerted when this happens; contact us rather than retrying in a\nloop, and do not reuse the key. In test mode a stuck claim\nself-heals after five minutes and the retry succeeds, so\n`issue_stuck` is not reproducible with a test key.\n",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "inProgress": {
                  "value": {
                    "code": "issue_in_progress",
                    "error": "A request with this idempotencyKey is still being processed"
                  }
                },
                "stuck": {
                  "value": {
                    "code": "issue_stuck",
                    "error": "A previous request with this idempotencyKey did not complete and needs manual review. Contact support with this idempotencyKey; do not reuse it."
                  }
                }
              }
            }
          }
        },
        "429": {
          "description": "Rate limited. Honour `Retry-After`. Limits are per key with separate\ncounters for test and live, so a test key cannot exhaust a live budget.\nDefault 120 requests per minute, burst 20 per second, adjustable per\npartner without a deploy.\n",
          "headers": {
            "Retry-After": {
              "schema": {
                "type": "integer",
                "enum": [
                  1,
                  60
                ]
              },
              "description": "Seconds to wait before retrying. 1 when the per-second burst limit\nwas hit, 60 when the per-minute limit was hit.\n"
            }
          },
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "rateLimited": {
                  "value": {
                    "code": "rate_limited",
                    "error": "Rate limit exceeded — more than 20 requests in one second"
                  }
                }
              }
            }
          },
          "x-ref": "#/components/responses/RateLimited"
        },
        "500": {
          "description": "Internal error. Always this exact shape — `{ error, code }` — even\nfor a fault deep inside the request. A top-level guard on this\nroute (added after the rest of this spec was first verified)\ncatches anything that would otherwise have escaped as a bare\nplatform error with no `code` to branch on.\n\nFor the ordinary case — something failed before any state was\ntouched, or during the mint step itself — any partial work is\nrolled back before responding: a debit is refunded and the claim\nreleased, so retrying with the same key is safe and will succeed.\n\nOne case is narrower: if the fault happens while this route is\nalready handling an abandoned claim from an earlier attempt (see\n`issue_stuck` above), nothing is rolled back on purpose — a debit\nfrom that earlier attempt may or may not have gone through, and\nguessing wrong would either double-charge or lose track of a\nvoucher. \"Safe to retry\" still holds in the sense that matters:\nthe same key can never mint twice. It does not guarantee the retry\nsucceeds — in this specific case it will most likely come back as\n`409 issue_stuck` rather than a fresh `201`, which is the correct\noutcome, not a bug to work around.\n",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "code",
                  "error"
                ],
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "Stable machine-readable code. Branch on this, not on `error`.\n",
                    "enum": [
                      "invalid_json",
                      "invalid_product",
                      "missing_idempotency_key",
                      "invalid_idempotency_key",
                      "unauthorized",
                      "forbidden",
                      "insufficient_balance",
                      "issue_in_progress",
                      "issue_stuck",
                      "rate_limited",
                      "internal_error"
                    ]
                  },
                  "error": {
                    "type": "string",
                    "description": "Human-readable message. Wording may change."
                  }
                },
                "x-ref": "#/components/schemas/Error"
              },
              "examples": {
                "internal": {
                  "value": {
                    "code": "internal_error",
                    "error": "Could not issue this voucher"
                  }
                }
              }
            }
          }
        }
      }
    },
    "reachable": true
  }
], 'BRONTIE', { server: {  }, secret: process.env.BRONTIE_SECRET })
})
