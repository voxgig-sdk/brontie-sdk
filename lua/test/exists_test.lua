-- Brontie SDK exists test

local sdk = require("brontie_sdk")

describe("BrontieSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
