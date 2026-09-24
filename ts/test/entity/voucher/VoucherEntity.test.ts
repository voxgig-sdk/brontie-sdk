

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { BrontieSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('VoucherEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when BRONTIE_TEST_LIVE=TRUE.
  afterEach(liveDelay('BRONTIE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = BrontieSDK.test()
    const ent = testsdk.Voucher()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.BRONTIE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'voucher.' + op, live)) return
    }

    if (live) { t.skip('Covered by live operation scenarios'); return }
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"idempotencyKey":{"a":true,"h":"Idempotency Key","n":"idempotencyKey","r":true,"sh":"Unique per gift on the partner side, scoped per partner and per mode.","t":"`$STRING`","key$":"idempotencyKey","index$":0},"message":{"a":true,"h":"Message","n":"message","r":false,"sh":"Short personal note shown with the gift.","t":"`$STRING`","key$":"message","index$":1},"product":{"a":true,"h":"Product","n":"product","r":true,"sh":"`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00.","t":"`$STRING`","key$":"product","index$":2},"recipient":{"a":true,"h":"Recipient","n":"recipient","r":false,"t":"`$OBJECT`","key$":"recipient","index$":3},"reference":{"a":true,"h":"Reference","n":"reference","r":false,"sh":"Your identifier.","t":"`$STRING`","key$":"reference","index$":4},"senderName":{"a":true,"h":"Sender Name","n":"senderName","r":false,"sh":"Who the gift appears to be from, per call, so it can vary by course or cohort.","t":"`$STRING`","key$":"senderName","index$":5}},"name":"voucher","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /api/v1/vouchers","source":"openapi3","version":2},"g":{},"k":"http","li":{"auth":"account","excluded":"Issues a permanent voucher; no delete or refund path exists","id":"voucher-create"},"m":"POST","o":"/api/v1/vouchers","q":{},"r":{},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"vouchers"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"voucher","name__orig":"voucher","Name":"Voucher","name_":"voucher","name-":"voucher","NAME":"VOUCHER","index$":1}, {"active":true,"entity":"voucher","key$":"BasicVoucherFlow","kind":"basic","name":"BasicVoucherFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"voucher_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'Voucher', {"POST /api/v1/vouchers":{"protocol":"http","operationId":"createVoucher","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["product","idempotencyKey"],"description":"Unknown fields are ignored rather than rejected. All string fields are\ntrimmed of surrounding whitespace before use.\n","properties":{"product":{"type":"string","enum":["coffee","coffee_and_cake"],"description":"`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00. Prices are fixed\nper product, not negotiated per partner.\n","x-ref":"#/components/schemas/Product","key$":"product"},"idempotencyKey":{"type":"string","maxLength":200,"minLength":1,"description":"Unique per gift on the partner side, scoped per partner and per\nmode. Derive it from your own data, for example learner ID plus\nmilestone. Do not use a timestamp or a UUID generated at call time:\na retry would produce a different key, which defeats the purpose.\n\nTrimmed before validation: a value that is whitespace-only is\nrejected as missing, and the 200-character limit applies to the\ntrimmed value.\n","examples":["alulu-8842-m3"],"key$":"idempotencyKey"},"recipient":{"type":"object","properties":{"name":{"type":"string","description":"Shown on the voucher. Not length limited server-side."},"email":{"type":"string","description":"Accepted for your records only, stored as sent — the server does\nnot validate that it is a well-formed address. Brontie does not\nemail the recipient. Most partners omit this.\n"}},"x-ref":"#/components/schemas/Recipient","key$":"recipient"},"senderName":{"type":"string","description":"Who the gift appears to be from, per call, so it can vary by course\nor cohort. Falls back to an account default when absent. Brontie\ncannot construct course names or dates: build the string on your\nside and send it here. Not length limited server-side.\n","examples":["Alulu - Data Foundations - 12 Sep 2026"],"key$":"senderName"},"message":{"type":"string","description":"Short personal note shown with the gift. Not length limited\nserver-side; keep it short so it displays well.\n","key$":"message"},"reference":{"type":"string","description":"Your identifier. Stored and returned unchanged. Not length limited\nserver-side.\n","key$":"reference"}},"x-ref":"#/components/schemas/CreateVoucherRequest","index$":1},"examples":{"milestone":{"summary":"Course milestone reward","value":{"product":"coffee","idempotencyKey":"alulu-8842-m3","recipient":{"name":"Aoife"},"senderName":"Alulu - Data Foundations - 12 Sep 2026","message":"Congratulations on finishing Module 3","reference":"alulu-learner-8842"}}}}}},"responses":{"200":{"description":"Idempotent replay. The original voucher for this key, not charged\nagain.\n\n# VERIFIED: balanceAfter on a replay is the balance NOW, not the\n# balance after the original debit.\nNote that `balanceAfter` in a replay is your balance at the time of\nthe replay, not the balance recorded when the voucher was first\nissued. If other vouchers have been issued since, it will differ\nfrom the 201 you originally received.\n","content":{"application/json":{"schema":{"allOf":[{"type":"object","required":["voucherToken","redeemLink","product","amount","expiresAt","balanceAfter","reference","mode"],"properties":{"voucherToken":{"type":"string","description":"Opaque voucher identifier. Test-mode tokens begin with `test_`.\n"},"redeemLink":{"type":"string","format":"uri","description":"The only field you need to keep. Surface this to the recipient.\nLive links are under `/brontie-coffee/`; test links are under\n`/api-sandbox/voucher/` and open a page stating the voucher cannot\nbe redeemed.\n"},"product":{"type":"string","enum":["coffee","coffee_and_cake"],"description":"`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00. Prices are fixed\nper product, not negotiated per partner.\n","x-ref":"#/components/schemas/Product"},"amount":{"type":"number","description":"Amount in EUR debited from the balance."},"expiresAt":{"type":"string","format":"date-time","description":"Five years from issue."},"balanceAfter":{"type":"number","description":"On a 201, the balance after this debit. For test keys nothing is\ndebited, so this is the untouched balance. On a 200 replay, see the\nnote on that response.\n"},"reference":{"type":"string","description":"Always present. Your `reference` echoed back unchanged, or an empty\nstring if you did not supply one.\n"},"mode":{"type":"string","enum":["live","test"],"description":"Derived from the API key prefix. A `test` voucher is not redeemable and\nits link opens a page stating so.\n","x-ref":"#/components/schemas/Mode"}},"x-ref":"#/components/schemas/Voucher"},{"type":"object","required":["idempotentReplay"],"properties":{"idempotentReplay":{"type":"boolean","const":true}}}],"index$":0},"examples":{"replay":{"value":{"voucherToken":"K6Ab9XUX1OYx","redeemLink":"https://www.brontie.ie/brontie-coffee/K6Ab9XUX1OYx","product":"coffee","amount":5,"expiresAt":"2031-09-06T00:00:00.000Z","balanceAfter":240,"reference":"alulu-learner-8842","mode":"live","idempotentReplay":true}}}}}},"201":{"description":"Voucher issued and balance debited.","content":{"application/json":{"schema":{"type":"object","required":["voucherToken","redeemLink","product","amount","expiresAt","balanceAfter","reference","mode"],"properties":{"voucherToken":{"type":"string","description":"Opaque voucher identifier. Test-mode tokens begin with `test_`.\n"},"redeemLink":{"type":"string","format":"uri","description":"The only field you need to keep. Surface this to the recipient.\nLive links are under `/brontie-coffee/`; test links are under\n`/api-sandbox/voucher/` and open a page stating the voucher cannot\nbe redeemed.\n"},"product":{"type":"string","enum":["coffee","coffee_and_cake"],"description":"`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00. Prices are fixed\nper product, not negotiated per partner.\n","x-ref":"#/components/schemas/Product"},"amount":{"type":"number","description":"Amount in EUR debited from the balance."},"expiresAt":{"type":"string","format":"date-time","description":"Five years from issue."},"balanceAfter":{"type":"number","description":"On a 201, the balance after this debit. For test keys nothing is\ndebited, so this is the untouched balance. On a 200 replay, see the\nnote on that response.\n"},"reference":{"type":"string","description":"Always present. Your `reference` echoed back unchanged, or an empty\nstring if you did not supply one.\n"},"mode":{"type":"string","enum":["live","test"],"description":"Derived from the API key prefix. A `test` voucher is not redeemable and\nits link opens a page stating so.\n","x-ref":"#/components/schemas/Mode"}},"x-ref":"#/components/schemas/Voucher"},"examples":{"issued":{"value":{"voucherToken":"K6Ab9XUX1OYx","redeemLink":"https://www.brontie.ie/brontie-coffee/K6Ab9XUX1OYx","product":"coffee","amount":5,"expiresAt":"2031-09-06T00:00:00.000Z","balanceAfter":245,"reference":"alulu-learner-8842","mode":"live"}}}}}},"400":{"description":"Malformed body or validation failed. Four codes, one per cause.\n","content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"invalidJson":{"summary":"Body is not valid JSON","value":{"code":"invalid_json","error":"Request body must be valid JSON"}},"invalidProduct":{"value":{"code":"invalid_product","error":"product must be \"coffee\" or \"coffee_and_cake\""}},"missingIdempotencyKey":{"summary":"Absent, not a string, or empty after trimming","value":{"code":"missing_idempotency_key","error":"idempotencyKey is required"}},"invalidIdempotencyKey":{"summary":"Longer than 200 characters after trimming","value":{"code":"invalid_idempotency_key","error":"idempotencyKey must be 200 characters or fewer"}}}}}},"401":{"description":"Key missing, malformed, revoked or unknown, or a key whose prefix does\nnot match the mode it was issued in.\n","content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"unauthorized":{"value":{"code":"unauthorized","error":"Invalid API key"}}}}},"x-ref":"#/components/responses/Unauthorized"},"402":{"description":"Insufficient balance. Nothing issued, nothing charged. Live mode\nonly: this response cannot occur for a test key.\n","content":{"application/json":{"schema":{"allOf":[{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},{"type":"object","required":["balance","required","currency","topUpUrl"],"properties":{"balance":{"type":"number","description":"Your balance at the moment of the request."},"required":{"type":"number","description":"The product amount that could not be debited."},"currency":{"type":"string","const":"EUR"},"topUpUrl":{"type":"string","format":"uri","description":"A mailto: link to Brontie, prefilled with the partner name.\nSelf-service top-up is not built yet, so this does not open a\npage — it opens an email. Balances are credited by arrangement\nuntil it does.\n"}}}],"x-ref":"#/components/schemas/InsufficientBalanceError"},"examples":{"outOfFunds":{"value":{"code":"insufficient_balance","error":"Insufficient balance to issue this voucher","balance":3,"required":5,"currency":"EUR","topUpUrl":"mailto:hello@brontie.ie?subject=Top-up%20request%20%E2%80%94%20Alulu"}}}}}},"403":{"description":"The key is valid but the call is not permitted: either the key lacks\nthe scope for this endpoint (`vouchers:create` or `balance:read`), or\nthe partner account has been deactivated.\n","content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"missingScope":{"value":{"code":"forbidden","error":"This API key is missing the \"vouchers:create\" scope"}},"inactivePartner":{"value":{"code":"forbidden","error":"This partner account is not active"}}}}},"x-ref":"#/components/responses/Forbidden"},"409":{"description":"Two distinct cases, separated by `code`. Branch on the code, not on\nthe status.\n\n`issue_in_progress`: a request with this key is genuinely in\nflight. Retry with backoff and you will receive the original\nvoucher. Occurs in both modes.\n\n`issue_stuck`: a claim for this key has been pending for more than\nfive minutes, meaning an earlier attempt died mid-issue. In live\nmode this is not resolved automatically, because money may already\nhave moved and only a human can reconcile it safely. Brontie is\nalerted when this happens; contact us rather than retrying in a\nloop, and do not reuse the key. In test mode a stuck claim\nself-heals after five minutes and the retry succeeds, so\n`issue_stuck` is not reproducible with a test key.\n","content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"inProgress":{"value":{"code":"issue_in_progress","error":"A request with this idempotencyKey is still being processed"}},"stuck":{"value":{"code":"issue_stuck","error":"A previous request with this idempotencyKey did not complete and needs manual review. Contact support with this idempotencyKey; do not reuse it."}}}}}},"429":{"description":"Rate limited. Honour `Retry-After`. Limits are per key with separate\ncounters for test and live, so a test key cannot exhaust a live budget.\nDefault 120 requests per minute, burst 20 per second, adjustable per\npartner without a deploy.\n","headers":{"Retry-After":{"schema":{"type":"integer","enum":[1,60]},"description":"Seconds to wait before retrying. 1 when the per-second burst limit\nwas hit, 60 when the per-minute limit was hit.\n"}},"content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"rateLimited":{"value":{"code":"rate_limited","error":"Rate limit exceeded — more than 20 requests in one second"}}}}},"x-ref":"#/components/responses/RateLimited"},"500":{"description":"Internal error. Always this exact shape — `{ error, code }` — even\nfor a fault deep inside the request. A top-level guard on this\nroute (added after the rest of this spec was first verified)\ncatches anything that would otherwise have escaped as a bare\nplatform error with no `code` to branch on.\n\nFor the ordinary case — something failed before any state was\ntouched, or during the mint step itself — any partial work is\nrolled back before responding: a debit is refunded and the claim\nreleased, so retrying with the same key is safe and will succeed.\n\nOne case is narrower: if the fault happens while this route is\nalready handling an abandoned claim from an earlier attempt (see\n`issue_stuck` above), nothing is rolled back on purpose — a debit\nfrom that earlier attempt may or may not have gone through, and\nguessing wrong would either double-charge or lose track of a\nvoucher. \"Safe to retry\" still holds in the sense that matters:\nthe same key can never mint twice. It does not guarantee the retry\nsucceeds — in this specific case it will most likely come back as\n`409 issue_stuck` rather than a fresh `201`, which is the correct\noutcome, not a bug to work around.\n","content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"internal":{"value":{"code":"internal_error","error":"Could not issue this voucher"}}}}}}},"parameters":[],"security":[{"bearerAuth":[]}],"securitySource":"definition","securitySchemes":{"bearerAuth":{"type":"http","scheme":"bearer","description":"API key as a bearer token. The key prefix determines the mode:\n`brontie_test_` for sandbox, `brontie_live_` for production. A key is\nshown once and cannot be recovered.\n"}},"live":{"auth":"account","excluded":"Issues a permanent voucher; no delete or refund path exists","id":"voucher-create"}}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const voucher_ref01_ent = client.Voucher()
    let voucher_ref01_data = setup.data.new.voucher['voucher_ref01']

    voucher_ref01_data = (await voucher_ref01_ent.create(voucher_ref01_data)).data()
    assert(null != voucher_ref01_data)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/voucher/VoucherTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = BrontieSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['voucher01','voucher02','voucher03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'BRONTIE_TEST_VOUCHER_ENTID': idmap,
    'BRONTIE_TEST_LIVE': 'FALSE',
    'BRONTIE_TEST_EXPLAIN': 'FALSE',
    'BRONTIE_APIKEY': '',
  })

  idmap = env['BRONTIE_TEST_VOUCHER_ENTID']

  const live = 'TRUE' === env.BRONTIE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['BRONTIE_TEST_VOUCHER_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new BrontieSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
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
    ]))
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
  }

  return setup
}
  
