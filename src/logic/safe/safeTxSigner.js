// @flow
import { List } from 'immutable'

const generateSignatureFrom = (account: string) => `000000000000000000000000${account.replace(
  '0x',
  '',
)}000000000000000000000000000000000000000000000000000000000000000001`

export const buildSignaturesFrom = (ownersWhoHasSigned: List<string>, sender: string) => {
  const signatures = ownersWhoHasSigned.push(sender)
  const orderedSignatures = signatures.sort() // JS by default sorts in a non case-senstive way

  let sigs = '0x'
  orderedSignatures.forEach((owner: string) => {
    sigs += generateSignatureFrom(owner)
  })

  return sigs
}
