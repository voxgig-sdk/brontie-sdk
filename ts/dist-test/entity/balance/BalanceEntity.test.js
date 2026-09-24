"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('BalanceEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when BRONTIE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('BRONTIE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.BrontieSDK.test();
        const ent = testsdk.Balance();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.BRONTIE_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'balance.' + op, live))
                return;
        }
        if (live) {
            t.skip('Covered by live operation scenarios');
            return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "alertAt": { "a": true, "h": "Alert At", "n": "alertAt", "r": true, "sh": "The threshold resolved to a euro figure: `lastTopUp × alertPercent`.", "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "alertAt", "index$": 0 }, "alertPercent": { "a": true, "h": "Alert Percent", "n": "alertPercent", "r": true, "sh": "Percentage of the most recent top-up at which the low-balance threshold sits.", "t": "`$NUMBER`", "key$": "alertPercent", "index$": 1 }, "balance": { "a": true, "h": "Balance", "n": "balance", "r": true, "t": "`$NUMBER`", "key$": "balance", "index$": 2 }, "currency": { "a": true, "h": "Currency", "n": "currency", "r": true, "t": "`$STRING`", "key$": "currency", "index$": 3 } }, "name": "balance", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /api/v1/balance", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "li": { "assert": { "equal": { "currency": "EUR" } }, "auth": "account", "id": "balance", "retention": "Read-only; creates nothing." }, "m": "GET", "o": "/api/v1/balance", "q": {}, "r": {}, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "balance" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "balance", "name__orig": "balance", "Name": "Balance", "name_": "balance", "name-": "balance", "NAME": "BALANCE", "index$": 0 }, { "active": true, "entity": "balance", "key$": "BasicBalanceFlow", "kind": "basic", "name": "BasicBalanceFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "balance_ref01", "srcdatavar": "balance_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-balance_ref01" } }], "index$": 0 }] }, 'Balance', { "GET /api/v1/balance": { "protocol": "http", "operationId": "getBalance", "responses": { "200": { "description": "Current balance.", "content": { "application/json": { "schema": { "type": "object", "required": ["balance", "currency", "alertPercent", "alertAt"], "properties": { "balance": { "key$": "balance", "type": "number" }, "currency": { "const": "EUR", "key$": "currency", "type": "string" }, "alertPercent": { "description": "Percentage of the most recent top-up at which the low-balance\nthreshold sits. Always present; defaults to 20.\n", "key$": "alertPercent", "type": "number" }, "alertAt": { "description": "The threshold resolved to a euro figure: `lastTopUp × alertPercent`.\n`null` until the first top-up has been made, because before then\nthere is nothing for the percentage to be a percentage of.\n", "key$": "alertAt", "type": ["number", "null"] } }, "x-ref": "#/components/schemas/Balance", "index$": 0 }, "examples": { "afterTopUp": { "summary": "After at least one top-up", "value": { "balance": 245, "currency": "EUR", "alertPercent": 30, "alertAt": 150 } }, "beforeFirstTopUp": { "summary": "Before any top-up — alertAt is null", "value": { "balance": 0, "currency": "EUR", "alertPercent": 30, "alertAt": null } } } } } }, "401": { "description": "Key missing, malformed, revoked or unknown, or a key whose prefix does\nnot match the mode it was issued in.\n", "content": { "application/json": { "schema": { "type": "object", "required": ["code", "error"], "properties": { "code": { "type": "string", "description": "Stable machine-readable code. Branch on this, not on `error`.\n", "enum": ["invalid_json", "invalid_product", "missing_idempotency_key", "invalid_idempotency_key", "unauthorized", "forbidden", "insufficient_balance", "issue_in_progress", "issue_stuck", "rate_limited", "internal_error"] }, "error": { "type": "string", "description": "Human-readable message. Wording may change." } }, "x-ref": "#/components/schemas/Error" }, "examples": { "unauthorized": { "value": { "code": "unauthorized", "error": "Invalid API key" } } } } }, "x-ref": "#/components/responses/Unauthorized" }, "403": { "description": "The key is valid but the call is not permitted: either the key lacks\nthe scope for this endpoint (`vouchers:create` or `balance:read`), or\nthe partner account has been deactivated.\n", "content": { "application/json": { "schema": { "type": "object", "required": ["code", "error"], "properties": { "code": { "type": "string", "description": "Stable machine-readable code. Branch on this, not on `error`.\n", "enum": ["invalid_json", "invalid_product", "missing_idempotency_key", "invalid_idempotency_key", "unauthorized", "forbidden", "insufficient_balance", "issue_in_progress", "issue_stuck", "rate_limited", "internal_error"] }, "error": { "type": "string", "description": "Human-readable message. Wording may change." } }, "x-ref": "#/components/schemas/Error" }, "examples": { "missingScope": { "value": { "code": "forbidden", "error": "This API key is missing the \"vouchers:create\" scope" } }, "inactivePartner": { "value": { "code": "forbidden", "error": "This partner account is not active" } } } } }, "x-ref": "#/components/responses/Forbidden" }, "429": { "description": "Rate limited. Honour `Retry-After`. Limits are per key with separate\ncounters for test and live, so a test key cannot exhaust a live budget.\nDefault 120 requests per minute, burst 20 per second, adjustable per\npartner without a deploy.\n", "headers": { "Retry-After": { "schema": { "type": "integer", "enum": [1, 60] }, "description": "Seconds to wait before retrying. 1 when the per-second burst limit\nwas hit, 60 when the per-minute limit was hit.\n" } }, "content": { "application/json": { "schema": { "type": "object", "required": ["code", "error"], "properties": { "code": { "type": "string", "description": "Stable machine-readable code. Branch on this, not on `error`.\n", "enum": ["invalid_json", "invalid_product", "missing_idempotency_key", "invalid_idempotency_key", "unauthorized", "forbidden", "insufficient_balance", "issue_in_progress", "issue_stuck", "rate_limited", "internal_error"] }, "error": { "type": "string", "description": "Human-readable message. Wording may change." } }, "x-ref": "#/components/schemas/Error" }, "examples": { "rateLimited": { "value": { "code": "rate_limited", "error": "Rate limit exceeded — more than 20 requests in one second" } } } } }, "x-ref": "#/components/responses/RateLimited" } }, "parameters": [], "security": [{ "bearerAuth": [] }], "securitySource": "definition", "securitySchemes": { "bearerAuth": { "type": "http", "scheme": "bearer", "description": "API key as a bearer token. The key prefix determines the mode:\n`brontie_test_` for sandbox, `brontie_live_` for production. A key is\nshown once and cannot be recovered.\n" } }, "live": { "assert": { "equal": { "currency": "EUR" } }, "auth": "account", "id": "balance", "input": {}, "retention": "Read-only; creates nothing." } } });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let balance_ref01_data = Object.values(setup.data.existing.balance)[0];
        // LOAD
        const balance_ref01_ent = client.Balance();
        const balance_ref01_match_dt0 = {};
        const balance_ref01_data_dt0 = (await balance_ref01_ent.load(balance_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != balance_ref01_data_dt0);
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/balance/BalanceTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.BrontieSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['balance01', 'balance02', 'balance03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'BRONTIE_TEST_BALANCE_ENTID': idmap,
        'BRONTIE_TEST_LIVE': 'FALSE',
        'BRONTIE_TEST_EXPLAIN': 'FALSE',
        'BRONTIE_APIKEY': '',
    });
    idmap = env['BRONTIE_TEST_BALANCE_ENTID'];
    const live = 'TRUE' === env.BRONTIE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['BRONTIE_TEST_BALANCE_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.BrontieSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.BRONTIE_APIKEY,
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.BRONTIE_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=BalanceEntity.test.js.map