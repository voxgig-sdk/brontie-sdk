

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
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"idempotencyKey":{"a":true,"h":"Idempotency Key","n":"idempotencyKey","r":true,"sh":"Unique per gift on the partner side, scoped per partner and per mode.","t":"`$STRING`","key$":"idempotencyKey","index$":0},"message":{"a":true,"h":"Message","n":"message","r":false,"sh":"Short personal note shown with the gift.","t":"`$STRING`","key$":"message","index$":1},"product":{"a":true,"h":"Product","n":"product","r":true,"sh":"`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00.","t":"`$STRING`","key$":"product","index$":2},"recipient":{"a":true,"h":"Recipient","n":"recipient","r":false,"t":"`$OBJECT`","key$":"recipient","index$":3},"reference":{"a":true,"h":"Reference","n":"reference","r":false,"sh":"Your identifier.","t":"`$STRING`","key$":"reference","index$":4},"senderName":{"a":true,"h":"Sender Name","n":"senderName","r":false,"sh":"Who the gift appears to be from, per call, so it can vary by course or cohort.","t":"`$STRING`","key$":"senderName","index$":5},"voucherToken":{"a":true,"h":"Voucher Token","n":"voucherToken","r":false,"ro":true,"sh":"Opaque voucher identifier.","t":"`$STRING`","key$":"voucherToken","index$":6}},"id":{"field":"voucherToken","name":"voucherToken"},"name":"voucher","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /api/v1/vouchers","source":"openapi3","version":2},"g":{},"k":"http","li":{"auth":"account","excluded":"Issues a permanent voucher; no delete or refund path exists","id":"voucher-create"},"m":"POST","o":"/api/v1/vouchers","q":{},"r":{},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"vouchers"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"voucher","name__orig":"voucher","Name":"Voucher","name_":"voucher","name-":"voucher","NAME":"VOUCHER","index$":1}, {"active":true,"entity":"voucher","key$":"BasicVoucherFlow","kind":"basic","name":"BasicVoucherFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"voucher_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'Voucher', {"POST /api/v1/vouchers":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["product","idempotencyKey"],"description":"Unknown fields are ignored rather than rejected. All string fields are\ntrimmed of surrounding whitespace before use.\n","properties":{"product":{"type":"string","enum":["coffee","coffee_and_cake"],"description":"`coffee` is EUR 5.00, `coffee_and_cake` is EUR 10.00. Prices are fixed\nper product, not negotiated per partner.\n","x-ref":"#/components/schemas/Product","key$":"product"},"idempotencyKey":{"type":"string","maxLength":200,"minLength":1,"description":"Unique per gift on the partner side, scoped per partner and per\nmode. Derive it from your own data, for example learner ID plus\nmilestone. Do not use a timestamp or a UUID generated at call time:\na retry would produce a different key, which defeats the purpose.\n\nTrimmed before validation: a value that is whitespace-only is\nrejected as missing, and the 200-character limit applies to the\ntrimmed value.\n","examples":["alulu-8842-m3"],"key$":"idempotencyKey"},"recipient":{"type":"object","properties":{"name":{"type":"string","description":"Shown on the voucher. Not length limited server-side."},"email":{"type":"string","description":"Accepted for your records only, stored as sent — the server does\nnot validate that it is a well-formed address. Brontie does not\nemail the recipient. Most partners omit this.\n"}},"x-ref":"#/components/schemas/Recipient","key$":"recipient"},"senderName":{"type":"string","description":"Who the gift appears to be from, per call, so it can vary by course\nor cohort. Falls back to an account default when absent. Brontie\ncannot construct course names or dates: build the string on your\nside and send it here. Not length limited server-side.\n","examples":["Alulu - Data Foundations - 12 Sep 2026"],"key$":"senderName"},"message":{"type":"string","description":"Short personal note shown with the gift. Not length limited\nserver-side; keep it short so it displays well.\n","key$":"message"},"reference":{"type":"string","description":"Your identifier. Stored and returned unchanged. Not length limited\nserver-side.\n","key$":"reference"}},"x-ref":"#/components/schemas/CreateVoucherRequest","index$":1},"examples":{"milestone":{"summary":"Course milestone reward","value":{"product":"coffee","idempotencyKey":"alulu-8842-m3","recipient":{"name":"Aoife"},"senderName":"Alulu - Data Foundations - 12 Sep 2026","message":"Congratulations on finishing Module 3","reference":"alulu-learner-8842"}}}}}},"parameters":[]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const voucher_ref01_ent = client.Voucher()
    let voucher_ref01_data = setup.data.new.voucher['voucher_ref01']

    voucher_ref01_data = (await voucher_ref01_ent.create(voucher_ref01_data)).data()
    assert(null != voucher_ref01_data.id)


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
  
