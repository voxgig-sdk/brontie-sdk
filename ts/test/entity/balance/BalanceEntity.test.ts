

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


describe('BalanceEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when BRONTIE_TEST_LIVE=TRUE.
  afterEach(liveDelay('BRONTIE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = BrontieSDK.test()
    const ent = testsdk.Balance()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.BRONTIE_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'balance.' + op, live)) return
    }

    if (live) { t.skip('Covered by live operation scenarios'); return }
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"alertAt":{"a":true,"h":"Alert At","n":"alertAt","r":true,"sh":"The threshold resolved to a euro figure: `lastTopUp × alertPercent`.","t":["`$ONE`",["`$NUMBER`","`$NULL`"]],"key$":"alertAt","index$":0},"alertPercent":{"a":true,"h":"Alert Percent","n":"alertPercent","r":true,"sh":"Percentage of the most recent top-up at which the low-balance threshold sits.","t":"`$NUMBER`","key$":"alertPercent","index$":1},"balance":{"a":true,"h":"Balance","n":"balance","r":true,"t":"`$NUMBER`","key$":"balance","index$":2},"currency":{"a":true,"h":"Currency","n":"currency","r":true,"t":"`$STRING`","key$":"currency","index$":3}},"name":"balance","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/v1/balance","source":"openapi3","version":2},"g":{},"k":"http","li":{"assert":{"equal":{"currency":"EUR"}},"auth":"account","id":"balance","retention":"Read-only; creates nothing."},"m":"GET","o":"/api/v1/balance","q":{},"r":{},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"balance"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"balance","name__orig":"balance","Name":"Balance","name_":"balance","name-":"balance","NAME":"BALANCE","index$":0}, {"active":true,"entity":"balance","key$":"BasicBalanceFlow","kind":"basic","name":"BasicBalanceFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"balance_ref01","srcdatavar":"balance_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-balance_ref01"}}],"index$":0}]}, 'Balance', {"GET /api/v1/balance":{"protocol":"http","operationId":"getBalance","responses":{"200":{"description":"Current balance.","content":{"application/json":{"schema":{"type":"object","required":["balance","currency","alertPercent","alertAt"],"properties":{"balance":{"key$":"balance","type":"number"},"currency":{"const":"EUR","key$":"currency","type":"string"},"alertPercent":{"description":"Percentage of the most recent top-up at which the low-balance\nthreshold sits. Always present; defaults to 20.\n","key$":"alertPercent","type":"number"},"alertAt":{"description":"The threshold resolved to a euro figure: `lastTopUp × alertPercent`.\n`null` until the first top-up has been made, because before then\nthere is nothing for the percentage to be a percentage of.\n","key$":"alertAt","type":["number","null"]}},"x-ref":"#/components/schemas/Balance","index$":0},"examples":{"afterTopUp":{"summary":"After at least one top-up","value":{"balance":245,"currency":"EUR","alertPercent":30,"alertAt":150}},"beforeFirstTopUp":{"summary":"Before any top-up — alertAt is null","value":{"balance":0,"currency":"EUR","alertPercent":30,"alertAt":null}}}}}},"401":{"description":"Key missing, malformed, revoked or unknown, or a key whose prefix does\nnot match the mode it was issued in.\n","content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"unauthorized":{"value":{"code":"unauthorized","error":"Invalid API key"}}}}},"x-ref":"#/components/responses/Unauthorized"},"403":{"description":"The key is valid but the call is not permitted: either the key lacks\nthe scope for this endpoint (`vouchers:create` or `balance:read`), or\nthe partner account has been deactivated.\n","content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"missingScope":{"value":{"code":"forbidden","error":"This API key is missing the \"vouchers:create\" scope"}},"inactivePartner":{"value":{"code":"forbidden","error":"This partner account is not active"}}}}},"x-ref":"#/components/responses/Forbidden"},"429":{"description":"Rate limited. Honour `Retry-After`. Limits are per key with separate\ncounters for test and live, so a test key cannot exhaust a live budget.\nDefault 120 requests per minute, burst 20 per second, adjustable per\npartner without a deploy.\n","headers":{"Retry-After":{"schema":{"type":"integer","enum":[1,60]},"description":"Seconds to wait before retrying. 1 when the per-second burst limit\nwas hit, 60 when the per-minute limit was hit.\n"}},"content":{"application/json":{"schema":{"type":"object","required":["code","error"],"properties":{"code":{"type":"string","description":"Stable machine-readable code. Branch on this, not on `error`.\n","enum":["invalid_json","invalid_product","missing_idempotency_key","invalid_idempotency_key","unauthorized","forbidden","insufficient_balance","issue_in_progress","issue_stuck","rate_limited","internal_error"]},"error":{"type":"string","description":"Human-readable message. Wording may change."}},"x-ref":"#/components/schemas/Error"},"examples":{"rateLimited":{"value":{"code":"rate_limited","error":"Rate limit exceeded — more than 20 requests in one second"}}}}},"x-ref":"#/components/responses/RateLimited"}},"parameters":[],"security":[{"bearerAuth":[]}],"securitySource":"definition","securitySchemes":{"bearerAuth":{"type":"http","scheme":"bearer","description":"API key as a bearer token. The key prefix determines the mode:\n`brontie_test_` for sandbox, `brontie_live_` for production. A key is\nshown once and cannot be recovered.\n"}},"live":{"assert":{"equal":{"currency":"EUR"}},"auth":"account","id":"balance","input":{},"retention":"Read-only; creates nothing."}}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let balance_ref01_data = Object.values(setup.data.existing.balance)[0] as any

    // LOAD
    const balance_ref01_ent = client.Balance()
    const balance_ref01_match_dt0: any = {}
    const balance_ref01_data_dt0 = (await balance_ref01_ent.load(balance_ref01_match_dt0)).data()
    assert(null != balance_ref01_data_dt0)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/balance/BalanceTestData.json')

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
    ['balance01','balance02','balance03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'BRONTIE_TEST_BALANCE_ENTID': idmap,
    'BRONTIE_TEST_LIVE': 'FALSE',
    'BRONTIE_TEST_EXPLAIN': 'FALSE',
    'BRONTIE_APIKEY': '',
  })

  idmap = env['BRONTIE_TEST_BALANCE_ENTID']

  const live = 'TRUE' === env.BRONTIE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['BRONTIE_TEST_BALANCE_ENTID']
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
  
