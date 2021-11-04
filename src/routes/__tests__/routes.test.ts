// Redirect https://<chain>.gnosis-safe.io to https://gnosis-safe.io
export const redirect = () => {
  const SHORT_NAMES = {
    arbitrum: 'arb1',
    bsc: 'bnb',
    ewc: 'ewt',
    polygon: 'matic',
    rinkeby: 'rin',
    volta: 'vt',
    xdai: 'xdai',
  }
  const host = window.location.host
  const chain = Object.keys(SHORT_NAMES).find(function (key) {
    return host.includes(key)
  })
  if (chain) {
    const newUrl = window.location.href
      .replace(`safe-team-${chain}`, 'safe-team') // staging
      .replace(`${chain}\.gnosis-safe\.io`, 'gnosis-safe.io') // prod
      .replace('#/safes/', `${SHORT_NAMES[chain]}:`) // EIP-3770 prefix
      .replace('#/', `${chain}/`) // old-style chain in the path

    window.location.replace(newUrl)
  }
}

describe('Legacy redirect tests', () => {
  it('redirects a specific safe on xdai (staging) ', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'https://safe-team-xdai.staging.gnosisdev.com/app/#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/balances',
        host: 'safe-team-xdai.staging.gnosisdev.com',
        replace: jest.fn(),
      },
    })

    redirect()

    expect(window.location.replace).toHaveBeenCalledWith(
      'https://safe-team.staging.gnosisdev.com/app/xdai:0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/balances',
    )
  })

  it('redirects a welcome page on arbitrum (staging) ', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'https://safe-team-arbitrum.staging.gnosisdev.com/app/#/welcome',
        host: 'safe-team-arbitrum.staging.gnosisdev.com',
        replace: jest.fn(),
      },
    })

    redirect()

    expect(window.location.replace).toHaveBeenCalledWith('https://safe-team.staging.gnosisdev.com/app/arbitrum/welcome')
  })

  it('redirects a specific safe on polygon (prod) ', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'https://polygon.gnosis-safe.io/app/#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/address-book',
        host: 'polygon.gnosis-safe.io',
        replace: jest.fn(),
      },
    })

    redirect()

    expect(window.location.replace).toHaveBeenCalledWith(
      'https://gnosis-safe.io/app/matic:0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/address-book',
    )
  })

  it('redirects the welcome page on EWC (prod) ', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'https://ewc.gnosis-safe.io/app/#/welcome',
        host: 'ewc.gnosis-safe.io',
        replace: jest.fn(),
      },
    })

    redirect()

    expect(window.location.replace).toHaveBeenCalledWith('https://gnosis-safe.io/app/ewc/welcome')
  })
})
