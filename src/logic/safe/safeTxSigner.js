// https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
// https://github.com/gnosis/safe-contracts/blob/master/test/gnosisSafeTeamEdition.js#L26
export const generateSignaturesFromTxConfirmations = (confirmations, preApprovingOwner) => {
  // The constant parts need to be sorted so that the recovered signers are sorted ascending
  // (natural order) by address (not checksummed).
  const confirmationsMap = confirmations.reduce((map, obj) => {
    map[obj.owner.toLowerCase()] = obj // eslint-disable-line no-param-reassign
    return map
  }, {})

  if (preApprovingOwner) {
    confirmationsMap[preApprovingOwner.toLowerCase()] = { owner: preApprovingOwner }
  }

  let sigs = '0x'
  Object.keys(confirmationsMap)
    .sort()
    .forEach((addr) => {
      const conf = confirmationsMap[addr]
      if (conf.signature) {
        sigs += conf.signature.slice(2)
      } else {
        // https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
        sigs += `000000000000000000000000${addr.replace(
          '0x',
          '',
        )}000000000000000000000000000000000000000000000000000000000000000001`
      }
    })
  return sigs
}
