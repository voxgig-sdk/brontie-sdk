-- Brontie SDK configuration

-- Build a fresh, fully materialised config table. Every call rebuilds the
-- whole structure, so prefer require("config_shared") unless you need a
-- private copy you intend to mutate.
local function make_config()
  return {
    main = {
      name = "Brontie",
      slug = "brontie",
      version = "0.0.1",
      target = "lua",
    },
    feature = {
      ["debug"] = {
        ["options"] = {
          ["active"] = false,
          ["max"] = 100,
          ["redact"] = {
            "authorization",
            "cookie",
            "set-cookie",
            "api-key",
            "apikey",
            "x-api-key",
            "idempotency-key",
          },
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
          ["onEntry"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["idempotency"] = {
        ["options"] = {
          ["active"] = false,
          ["header"] = "Idempotency-Key",
          ["methods"] = {
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          },
          ["ops"] = {
            "create",
            "update",
            "remove",
          },
        },
        ["optspec"] = {
          ["keygen"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["metrics"] = {
        ["options"] = {
          ["active"] = false,
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["paging"] = {
        ["options"] = {
          ["active"] = false,
          ["afterVar"] = "after",
          ["cursorParam"] = "cursor",
          ["firstVar"] = "first",
          ["limitParam"] = "limit",
          ["pageParam"] = "page",
          ["startPage"] = 1,
        },
        ["optspec"] = {
          ["limit"] = "`$NUMBER`",
          ["ops"] = "`$LIST`",
        },
        ["strict"] = false,
        ["transport"] = "none",
      },
      ["ratelimit"] = {
        ["options"] = {
          ["active"] = false,
          ["burst"] = 5,
          ["rate"] = 5,
        },
        ["optspec"] = {
          ["now"] = "`$FUNCTION`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["retry"] = {
        ["options"] = {
          ["active"] = false,
          ["factor"] = 2,
          ["maxDelay"] = 2000,
          ["minDelay"] = 50,
          ["retries"] = 2,
          ["statuses"] = {
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          },
        },
        ["optspec"] = {
          ["jitter"] = "`$BOOLEAN`",
          ["sleep"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
      ["test"] = {
        ["options"] = {
          ["active"] = false,
        },
        ["optspec"] = {
          ["entity"] = "`$MAP`",
          ["net"] = "`$MAP`",
        },
        ["strict"] = false,
        ["transport"] = "base",
      },
      ["timeout"] = {
        ["options"] = {
          ["active"] = false,
          ["ms"] = 30000,
        },
        ["optspec"] = {
          ["clearTimer"] = "`$FUNCTION`",
          ["setTimer"] = "`$FUNCTION`",
        },
        ["strict"] = false,
        ["transport"] = "wrap",
      },
    },
    options = {
      base = "https://www.brontie.ie",
      auth = {
        prefix = "Bearer",
      },
      headers = {
        ["content-type"] = "application/json",
      },
      entity = {
        ["balance"] = {},
        ["voucher"] = {},
      },
    },
    entity = {
      ["balance"] = {
        ["fields"] = {
          {
            ["name"] = "alertAt",
            ["title"] = "Alert At",
            ["type"] = {
              "`$ONE`",
              {
                "`$NUMBER`",
                "`$NULL`",
              },
            },
            ["req"] = true,
            ["short"] = "The threshold resolved to a euro figure: `lastTopUp × alertPercent`.",
          },
          {
            ["name"] = "alertPercent",
            ["title"] = "Alert Percent",
            ["type"] = "`$NUMBER`",
            ["req"] = true,
            ["short"] = "Percentage of the most recent top-up at which the low-balance threshold sits.",
          },
          {
            ["name"] = "balance",
            ["title"] = "Balance",
            ["type"] = "`$NUMBER`",
            ["req"] = true,
          },
          {
            ["name"] = "currency",
            ["title"] = "Currency",
            ["type"] = "`$STRING`",
            ["req"] = true,
          },
        },
        ["name"] = "balance",
        ["op"] = {
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/api/v1/balance",
                ["segments"] = {
                  {
                    ["lit"] = "api",
                  },
                  {
                    ["lit"] = "v1",
                  },
                  {
                    ["lit"] = "balance",
                  },
                },
                ["parts"] = {
                  "api",
                  "v1",
                  "balance",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {},
                ["select"] = {},
                ["live"] = {
                  ["assert"] = {
                    ["equal"] = {
                      ["currency"] = "EUR",
                    },
                  },
                  ["auth"] = "account",
                  ["id"] = "balance",
                  ["retention"] = "Read-only; creates nothing.",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["voucher"] = {
        ["fields"] = {
          {
            ["name"] = "idempotencyKey",
            ["title"] = "Idempotency Key",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "Unique per gift on the partner side, scoped per partner and per mode.",
          },
          {
            ["name"] = "message",
            ["title"] = "Message",
            ["type"] = "`$STRING`",
            ["short"] = "Short personal note shown with the gift.",
          },
          {
            ["name"] = "product",
            ["title"] = "Product",
            ["type"] = "`$STRING`",
            ["req"] = true,
            ["short"] = "`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00.",
          },
          {
            ["name"] = "recipient",
            ["title"] = "Recipient",
            ["type"] = "`$OBJECT`",
          },
          {
            ["name"] = "reference",
            ["title"] = "Reference",
            ["type"] = "`$STRING`",
            ["short"] = "Your identifier.",
          },
          {
            ["name"] = "senderName",
            ["title"] = "Sender Name",
            ["type"] = "`$STRING`",
            ["short"] = "Who the gift appears to be from, per call, so it can vary by course or cohort.",
          },
        },
        ["name"] = "voucher",
        ["op"] = {
          ["create"] = {
            ["input"] = "data",
            ["name"] = "create",
            ["points"] = {
              {
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/api/v1/vouchers",
                ["segments"] = {
                  {
                    ["lit"] = "api",
                  },
                  {
                    ["lit"] = "v1",
                  },
                  {
                    ["lit"] = "vouchers",
                  },
                },
                ["parts"] = {
                  "api",
                  "v1",
                  "vouchers",
                },
                ["rename"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
                ["args"] = {},
                ["select"] = {},
                ["live"] = {
                  ["auth"] = "account",
                  ["excluded"] = "Issues a permanent voucher; no delete or refund path exists",
                  ["id"] = "voucher-create",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
    },
  }
end


local function make_feature(name)
  local features = require("features")
  local factory = features[name]
  if factory ~= nil then
    return factory()
  end
  return features.base()
end


-- Attach make_feature to the SDK class
local function setup_sdk(SDK)
  SDK._make_feature = make_feature
end


return make_config
