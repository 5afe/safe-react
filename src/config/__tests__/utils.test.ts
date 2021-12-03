import { evalTemplate } from '../utils'

describe('replaceTemplateParams', () => {
  it('replace a template param', () => {
    const str = 'https://rinkeby.etherscan.io/address/{{address}}'

    expect(evalTemplate(str, { address: '0x123' })).toBe('https://rinkeby.etherscan.io/address/0x123')
  })
  it('replaces multiple template params', () => {
    const str =
      'https://api-rinkeby.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}'

    const params = {
      module: 'contract',
      action: 'getAbi',
      address: '0x123',
      apiKey: 'test',
    }

    expect(evalTemplate(str, params)).toBe(
      'https://api-rinkeby.etherscan.io/api?module=contract&action=getAbi&address=0x123&apiKey=test',
    )
  })
})
