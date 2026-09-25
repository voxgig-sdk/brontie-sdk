# Voucher entity test

import json
import os
import time

import pytest

from brontie_sdk.utility.voxgig_struct import voxgig_struct as vs
from brontie_sdk import BrontieSDK
from brontie_sdk.core import helpers

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner


class TestVoucherEntity:

    def test_should_create_instance(self):
        testsdk = BrontieSDK.test(None, None)
        ent = testsdk.Voucher(None)
        assert ent is not None

    def test_should_run_basic_flow(self):
        setup = _voucher_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "voucher." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        # The basic flow consumes synthetic IDs from the fixture. In live mode
        # without an *_ENTID env override, those IDs hit the live API and 4xx.
        if setup.get("synthetic_only"):
            pytest.skip("live entity test uses synthetic IDs from fixture — "
                        "set BRONTIE_TEST_VOUCHER_ENTID JSON to run live")
        client = setup["client"]

        # CREATE
        voucher_ref01_ent = client.Voucher(None)
        voucher_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.voucher"), "voucher_ref01"))

        voucher_ref01_data = helpers.to_map(runner.entity_data(voucher_ref01_ent.create(voucher_ref01_data, None)))
        assert voucher_ref01_data is not None
        assert voucher_ref01_data["id"] is not None



def _voucher_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/voucher/VoucherTestData.json")
    with open(entity_data_file, "r") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = BrontieSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["voucher01", "voucher02", "voucher03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Detect ENTID env override before envOverride consumes it. When live
    # mode is on without a real override, the basic test runs against synthetic
    # IDs from the fixture and 4xx's. We surface this so the test can skip.
    _entid_env_raw = os.environ.get(
        "BRONTIE_TEST_VOUCHER_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "BRONTIE_TEST_VOUCHER_ENTID": idmap,
        "BRONTIE_TEST_LIVE": "FALSE",
        "BRONTIE_TEST_EXPLAIN": "FALSE",
        "BRONTIE_APIKEY": "",
    })

    idmap_resolved = helpers.to_map(
        env.get("BRONTIE_TEST_VOUCHER_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("BRONTIE_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            # FIRST, so the generated fields below win: sdk-test-control.json's
            # test.client.options adds to the live client, it does not
            # redirect it.
            runner.live_client_options(),
            {
                "apikey": env.get("BRONTIE_APIKEY"),
            },
            extra or {},
        ])
        client = BrontieSDK(helpers.to_map(merged_opts))

    _live = env.get("BRONTIE_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("BRONTIE_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
