import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "balance",
    "accessor": "Balance",
    "op": "load",
    "method": "GET",
    "path": "/api/v1/balance",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "balance": 245,
      "currency": "EUR",
      "alertPercent": 30,
      "alertAt": 150
    },
    "idField": "id"
  },
  {
    "entity": "voucher",
    "accessor": "Voucher",
    "op": "create",
    "method": "POST",
    "path": "/api/v1/vouchers",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "voucherToken": "K6Ab9XUX1OYx",
      "redeemLink": "https://www.brontie.ie/brontie-coffee/K6Ab9XUX1OYx",
      "product": "coffee",
      "amount": 5,
      "expiresAt": "2031-09-06T00:00:00.000Z",
      "balanceAfter": 240,
      "reference": "alulu-learner-8842",
      "mode": "live",
      "idempotentReplay": true
    },
    "idField": "voucherToken"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
