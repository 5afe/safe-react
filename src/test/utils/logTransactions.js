// @flow
import { getGnosisSafeInstanceAt } from '~/wallets/safeContracts'

export const printOutApprove = async (
  subject: string,
  address: string,
  owners: string[],
  data: string,
  nonce: number,
) => {
  // eslint-disable-next-line
  console.log(subject)

  const gnosisSafe = await getGnosisSafeInstanceAt(address)
  const transactionHash = await gnosisSafe.getTransactionHash(address, 0, data, 0, nonce)
  // eslint-disable-next-line
  console.log(`EO transaction hash ${transactionHash}`)

  await Promise.all(owners.map(async (owner, index) => {
    const approved = await gnosisSafe.isApproved(transactionHash, owner)
    // eslint-disable-next-line
    console.log(`EO transaction approved by owner index ${index}: ${approved}`)
  }))
  // eslint-disable-next-line
  console.log(`EO transaction executed ${await gnosisSafe.isExecuted(transactionHash)}`)
}
