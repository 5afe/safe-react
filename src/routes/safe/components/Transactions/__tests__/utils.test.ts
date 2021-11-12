import { getTxAccordionExpandedProp } from '../TxList/utils'
import { history } from 'src/routes/routes'

describe('getTxAccordionExpandedProp', () => {
  it('returns true when a safeTxHash is in the URL', () => {
    const pathname =
      '/rin:0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f/transactions/0x584c3af10637c2bd920a5fbab402cde12f4797e22ffad6326c667175f00336ed'
    history.push(pathname)

    expect(getTxAccordionExpandedProp()).toBe(true)
  })
  it('returns undefined when no safeTxHash is in the URL', () => {
    const pathname = '/rin:0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f/transactions/history'
    history.push(pathname)

    expect(getTxAccordionExpandedProp()).toBe(undefined)
  })
  it('returns undefined when an invalid safeTxHash is in the URL', () => {
    // 3 characters too short
    const pathname =
      '/rin:0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f/transactions/0x584c3af10637c2bd920a5fbab402cde12f4797e22ffad6326c667175f0033'
    history.push(pathname)

    expect(getTxAccordionExpandedProp()).toBe(undefined)
  })
})
