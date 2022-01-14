import { render } from '@testing-library/react'

import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { history } from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'
import XDaiGCRedirection from '../XDaiGCRedirection'

describe('XDaiGCRedirection', () => {
  it('redirects the xDai shortName to Gnosis Chain one', () => {
    history.push(`/xdai:${ZERO_ADDRESS}`)

    render(<XDaiGCRedirection history={history} />)

    expect(window.location.pathname).toBe(`/gno:${ZERO_ADDRESS}`)
  })
  it("doesn't redirect other shortNames", () => {
    history.push(`/rin:${ZERO_ADDRESS}`)

    render(<XDaiGCRedirection history={history} />)

    expect(window.location.pathname).toBe(`/rin:${ZERO_ADDRESS}`)
  })
  it("doesn't redirect legacy links", () => {
    history.push(`/#/safes/${ZERO_ADDRESS}`)

    render(<XDaiGCRedirection history={history} />)

    // pathname will be '/' because a hash was pushed to the history stack
    expect(window.location.pathname).toBe(`/`)
  })
})
