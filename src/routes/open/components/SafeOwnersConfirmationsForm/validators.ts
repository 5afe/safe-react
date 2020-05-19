import { uniqueAddress } from 'src/components/forms/validator'

export const getAddressValidator = (addresses, position) => {
  // thanks Rich Harris
  // https://twitter.com/Rich_Harris/status/1125850391155965952
  const copy = addresses.slice()
  copy[position] = copy[copy.length - 1]
  copy.pop()

  return uniqueAddress(copy)
}
