
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { BrontieSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = BrontieSDK.test()
    equal(testsdk instanceof BrontieSDK, true,
      'BrontieSDK.test() must return a client synchronously')
  })

})
