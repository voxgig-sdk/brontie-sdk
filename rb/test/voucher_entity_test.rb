# Voucher entity test

require "minitest/autorun"
require "json"
require_relative "../Brontie_sdk"
require_relative "runner"

class VoucherEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = BrontieSDK.test(nil, nil)
    ent = testsdk.Voucher(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = BrontieConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = BrontieSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Voucher(nil).create({ "amount" => "x", "balanceAfter" => 1, "expiresAt" => "x", "idempotencyKey" => "x", "idempotentReplay" => true, "mode" => "x", "product" => "x", "redeemLink" => "x", "reference" => "x", "voucherToken" => "x" }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = voucher_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "voucher." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # CREATE
    voucher_ref01_ent = client.Voucher(nil)
    voucher_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.voucher"), "voucher_ref01"))

    voucher_ref01_data_result = voucher_ref01_ent.create(voucher_ref01_data, nil)
    voucher_ref01_data = Helpers.to_map(voucher_ref01_data_result.respond_to?(:data_get) ? voucher_ref01_data_result.data_get : voucher_ref01_data_result)
    assert !voucher_ref01_data.nil?
    assert !voucher_ref01_data["id"].nil?

  end
end

def voucher_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "voucher", "VoucherTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = BrontieSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["voucher01", "voucher02", "voucher03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["BRONTIE_TEST_VOUCHER_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "BRONTIE_TEST_VOUCHER_ENTID" => idmap,
    "BRONTIE_TEST_LIVE" => "FALSE",
    "BRONTIE_TEST_EXPLAIN" => "FALSE",
    "BRONTIE_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["BRONTIE_TEST_VOUCHER_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["BRONTIE_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["BRONTIE_APIKEY"],
      },
      extra || {},
    ])
    client = BrontieSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["BRONTIE_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["BRONTIE_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
