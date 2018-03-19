// @flow
import Web3 from 'web3'

const getWeb3 = () => new Promise((resolve) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
    let { web3 } = window

    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      // eslint-disable-next-line
      console.log('Injected web3 detected.')

      resolve({ web3 })
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')

      web3 = new Web3(provider)

      // eslint-disable-next-line
      console.log('No web3 instance injected, using Local web3.')

      resolve({ web3 })
    }
  })
})

export const promisify = (inner: Function): Promise<any> =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    }))

export const ensureOnce = (fn: Function): Function => {
  let executed = false
  let response

  return (...args) => {
    if (executed) { return response }

    executed = true
    response = fn(args)

    return response
  }
}

export default ensureOnce(getWeb3)
