

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
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"alertAt":{"a":true,"h":"Alert At","n":"alertAt","r":true,"sh":"The threshold resolved to a euro figure: `lastTopUp × alertPercent`.","t":["`$ONE`",["`$NUMBER`","`$NULL`"]],"key$":"alertAt","index$":0},"alertPercent":{"a":true,"h":"Alert Percent","n":"alertPercent","r":true,"sh":"Percentage of the most recent top-up at which the low-balance threshold sits.","t":"`$NUMBER`","key$":"alertPercent","index$":1},"balance":{"a":true,"h":"Balance","n":"balance","r":true,"t":"`$NUMBER`","key$":"balance","index$":2},"currency":{"a":true,"h":"Currency","n":"currency","r":true,"t":"`$STRING`","key$":"currency","index$":3}},"name":"balance","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/v1/balance","source":"openapi3","version":2},"g":{},"k":"http","li":{"assert":{"equal":{"currency":"EUR"}},"auth":"account","id":"balance","retention":"Read-only; creates nothing."},"m":"GET","o":"/api/v1/balance","q":{},"r":{},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"balance"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"balance","name__orig":"balance","Name":"Balance","name_":"balance","name-":"balance","NAME":"BALANCE","index$":0}, {"active":true,"entity":"balance","key$":"BasicBalanceFlow","kind":"basic","name":"BasicBalanceFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"balance_ref01","srcdatavar":"balance_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-balance_ref01"}}],"index$":0}]}, 'Balance', {"GET /api/v1/balance":{"protocol":"http","parameters":[]}})
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
  
