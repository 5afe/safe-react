import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'

export const calculateTxFee = async (safe, safeAddress, from, data, to, valueInWei, operation) => {
  try {
    let safeInstance = safe
    if (!safeInstance) {
      safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    }

    // https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
    const sigs = `0x000000000000000000000000${from.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`

    // we get gas limit from this call, then it needs to be multiplied by the gas price
    // https://safe-relay.gnosis.pm/api/v1/gas-station/
    // https://safe-relay.rinkeby.gnosis.pm/api/v1/about/
    const estimate = await safeInstance.execTransaction.estimateGas(
      to,
      valueInWei,
      data,
      operation,
      0,
      0,
      0,
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000',
      sigs,
      { from: '0xbc2BB26a6d821e69A38016f3858561a1D80d4182' },
    )

    return estimate
  } catch (error) {
    console.error('Error calculating tx gas estimation', error)
    return 0
  }
}
