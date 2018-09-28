// @flow
const generateSignatureFrom = (account: string) =>
  `000000000000000000000000${account.replace('0x', '')}000000000000000000000000000000000000000000000000000000000000000001`

export const buildSignaturesFrom = (ownersWhoHasSigned: string[], sender: string) => {
  let sigs = '0x'
  ownersWhoHasSigned.forEach((owner: string) => {
    sigs += generateSignatureFrom(owner)
  })
  sigs += generateSignatureFrom(sender)

  return sigs
}
