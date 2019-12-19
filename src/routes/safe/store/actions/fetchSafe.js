// @flow
import type { Dispatch as ReduxDispatch } from "redux"
import { List } from "immutable"
import { type GlobalState } from "~/store/index"
import { makeOwner } from "~/routes/safe/store/models/owner"
import type { SafeProps } from "~/routes/safe/store/models/safe"
import addSafe from "~/routes/safe/store/actions/addSafe"
import { getSafeName, getLocalSafe } from "~/logic/safe/utils"
import { getGnosisSafeInstanceAt } from "~/logic/contracts/safeContracts"
import { getBalanceInEtherOf } from "~/logic/wallets/getWeb3"
import { sameAddress } from "~/logic/wallets/ethAddresses"
import removeSafeOwner from "~/routes/safe/store/actions/removeSafeOwner"
import addSafeOwner from "~/routes/safe/store/actions/addSafeOwner"
import updateSafeThreshold from "~/routes/safe/store/actions/updateSafeThreshold"
import { sameAddress } from "~/logic/wallets/ethAddresses"

const buildOwnersFrom = (
  safeOwners: string[],
  localSafe: SafeProps | {} // eslint-disable-next-line
) =>
  safeOwners.map((ownerAddress: string) => {
    if (!localSafe) {
      return makeOwner({ name: "UNKNOWN", address: ownerAddress })
    }

    const storedOwner = localSafe.owners.find(({ address }) =>
      sameAddress(address, ownerAddress)
    )
    if (!storedOwner) {
      return makeOwner({ name: "UNKNOWN", address: ownerAddress })
    }

    return makeOwner({
      name: storedOwner.name || "UNKNOWN",
      address: ownerAddress
    })
  })

export const buildSafe = async (safeAddress: string, safeName: string) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const ethBalance = await getBalanceInEtherOf(safeAddress)

  const threshold = Number(await gnosisSafe.getThreshold())
  const nonce = Number(await gnosisSafe.nonce())
  const owners = List(
    buildOwnersFrom(
      await gnosisSafe.getOwners(),
      await getLocalSafe(safeAddress)
    )
  )

  const safe: SafeProps = {
    address: safeAddress,
    name: safeName,
    threshold,
    owners,
    ethBalance,
    nonce
  }

  return safe
}

export const checkAndUpdateSafe = (safeAddress: string) => async (
  dispatch: ReduxDispatch<*>
) => {
  // Check if the owner's safe did change and update them
  const [gnosisSafe, localSafe] = await Promise.all([
    getGnosisSafeInstanceAt(safeAddress),
    getLocalSafe(safeAddress)
  ])

  const remoteOwners = await gnosisSafe.getOwners()
  // Converts from [ { address, ownerName} ] to address array
  const localOwners = localSafe.owners.map(localOwner => localOwner.address)

  // Updates threshold values
  const threshold = await gnosisSafe.getThreshold()
  localSafe.threshold = threshold.toNumber()

  dispatch(
    updateSafeThreshold({ safeAddress, threshold: threshold.toNumber() })
  )
  // If the remote owners does not contain a local address, we remove that local owner
  localOwners.forEach(localAddress => {
    const remoteOwnerIndex = remoteOwners.findIndex(remoteAddress =>
      sameAddress(remoteAddress, localAddress)
    )
    if (remoteOwnerIndex === -1) {
      dispatch(removeSafeOwner({ safeAddress, ownerAddress: localAddress }))
    }
  })

  // If the remote has an owner that we don't have locally, we add it
  remoteOwners.forEach(remoteAddress => {
    const localOwnerIndex = localOwners.findIndex(localAddress =>
      sameAddress(remoteAddress, localAddress)
    )
    if (localOwnerIndex === -1) {
      dispatch(
        addSafeOwner({
          safeAddress,
          ownerAddress: remoteAddress,
          ownerName: "UNKNOWN"
        })
      )
    }
  })
}

// eslint-disable-next-line consistent-return
export default (safeAddress: string) => async (
  dispatch: ReduxDispatch<GlobalState>
) => {
  try {
    const safeName = (await getSafeName(safeAddress)) || "LOADED SAFE"
    const safeProps: SafeProps = await buildSafe(safeAddress, safeName)

    dispatch(addSafe(safeProps))
  } catch (err) {
    // eslint-disable-next-line
    console.error("Error while updating Safe information: ", err)

    return Promise.resolve()
  }
}
