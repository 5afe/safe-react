// @flow
import {
  required,
  composeValidators,
  uniqueAddress,
  mustBeEthereumAddress,
} from '~/components/forms/validator'

export const getAddressValidators = (addresses: string[], position: number) => {
  // thanks Rich Harris
  // https://twitter.com/Rich_Harris/status/1125850391155965952
  const copy = addresses.slice()
  copy[position] = copy[copy.length - 1]
  copy.pop()

  return composeValidators(required, mustBeEthereumAddress, uniqueAddress(copy))
}