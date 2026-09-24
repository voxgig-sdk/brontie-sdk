# Brontie SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "Brontie",
            "slug": "brontie",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "debug": {
        "options": {
          "active": False,
          "max": 100,
          "redact": [
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          ],
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "onEntry": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "idempotency": {
        "options": {
          "active": False,
          "header": "Idempotency-Key",
          "methods": [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          ],
          "ops": [
            "create",
            "update",
            "remove",
          ],
        },
        "optspec": {
          "keygen": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "metrics": {
        "options": {
          "active": False,
        },
        "optspec": {
          "now": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "none",
      },
            "paging": {
        "options": {
          "active": False,
          "afterVar": "after",
          "cursorParam": "cursor",
          "firstVar": "first",
          "limitParam": "limit",
          "pageParam": "page",
          "startPage": 1,
        },
        "optspec": {
          "limit": "`$NUMBER`",
          "ops": "`$LIST`",
        },
        "strict": False,
        "transport": "none",
      },
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://www.brontie.ie",
            "auth": {
                "prefix": "Bearer",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "balance": {},
                "voucher": {},
            },
        },
        "entity": {
      "balance": {
        "fields": [
          {
            "name": "alertAt",
            "title": "Alert At",
            "type": [
              "`$ONE`",
              [
                "`$NUMBER`",
                "`$NULL`",
              ],
            ],
            "req": True,
            "short": "The threshold resolved to a euro figure: `lastTopUp × alertPercent`.",
          },
          {
            "name": "alertPercent",
            "title": "Alert Percent",
            "type": "`$NUMBER`",
            "req": True,
            "short": "Percentage of the most recent top-up at which the low-balance threshold sits.",
          },
          {
            "name": "balance",
            "title": "Balance",
            "type": "`$NUMBER`",
            "req": True,
          },
          {
            "name": "currency",
            "title": "Currency",
            "type": "`$STRING`",
            "req": True,
          },
        ],
        "name": "balance",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/api/v1/balance",
                "segments": [
                  {
                    "lit": "api",
                  },
                  {
                    "lit": "v1",
                  },
                  {
                    "lit": "balance",
                  },
                ],
                "parts": [
                  "api",
                  "v1",
                  "balance",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
                "live": {
                  "assert": {
                    "equal": {
                      "currency": "EUR",
                    },
                  },
                  "auth": "account",
                  "id": "balance",
                  "retention": "Read-only; creates nothing.",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "voucher": {
        "fields": [
          {
            "name": "idempotencyKey",
            "title": "Idempotency Key",
            "type": "`$STRING`",
            "req": True,
            "short": "Unique per gift on the partner side, scoped per partner and per mode.",
          },
          {
            "name": "message",
            "title": "Message",
            "type": "`$STRING`",
            "short": "Short personal note shown with the gift.",
          },
          {
            "name": "product",
            "title": "Product",
            "type": "`$STRING`",
            "req": True,
            "short": "`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00.",
          },
          {
            "name": "recipient",
            "title": "Recipient",
            "type": "`$OBJECT`",
          },
          {
            "name": "reference",
            "title": "Reference",
            "type": "`$STRING`",
            "short": "Your identifier.",
          },
          {
            "name": "senderName",
            "title": "Sender Name",
            "type": "`$STRING`",
            "short": "Who the gift appears to be from, per call, so it can vary by course or cohort.",
          },
        ],
        "name": "voucher",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/api/v1/vouchers",
                "segments": [
                  {
                    "lit": "api",
                  },
                  {
                    "lit": "v1",
                  },
                  {
                    "lit": "vouchers",
                  },
                ],
                "parts": [
                  "api",
                  "v1",
                  "vouchers",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
                "live": {
                  "auth": "account",
                  "excluded": "Issues a permanent voucher; no delete or refund path exists",
                  "id": "voucher-create",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
