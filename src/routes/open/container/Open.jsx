// @flow
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
//import queryString from 'query-string'

import Opening from '../../opening'
import Layout from '../components/Layout'

import actions, { type Actions, type AddSafe } from './actions'
import selector from './selector'

import { Loader } from '~/components-v2'
import Page from '~/components/layout/Page'
import { getGnosisSafeInstanceAt, getSafeDeploymentTransaction } from '~/logic/contracts/safeContracts'
import { checkReceiptStatus } from '~/logic/wallets/ethTransactions'
import {
  getAccountsFrom,
  getNamesFrom,
  getOwnersFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from '~/routes/open/utils/safeDataExtractor'
// import { OPENING_ADDRESS, SAFELIST_ADDRESS, stillInOpeningView } from '~/routes/routes'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
// import { history } from '~/store'
import { loadFromStorage, removeFromStorage, saveToStorage } from '~/utils/storage'

const SAFE_PENDING_CREATION_HASH_STORAGE_KEY = 'SAFE_PENDING_CREATION_HASH_STORAGE_KEY'

type Props = Actions & {
  provider: string,
  userAccount: string,
  network: string,
}

export type OpenState = {
  safeAddress: string,
}

export type SafePropsType = {
  name: string,
  ownerAddresses: string[],
  ownerNames: string[],
  threshold: string,
}

// const validateQueryParams = (
//   ownerAddresses?: string[],
//   ownerNames?: string[],
//   threshold?: string,
//   safeName?: string,
// ) => {
//   if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
//     return false
//   }
//   if (!ownerAddresses.length === 0 || ownerNames.length === 0) {
//     return false
//   }

//   if (Number.isNaN(Number(threshold))) {
//     return false
//   }
//   if (threshold > ownerAddresses.length) {
//     return false
//   }
//   return true
// }

export const createSafe = (values: Object, userAccount: string, addSafe: AddSafe): Promise<OpenState> => {
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const ownersNames = getNamesFrom(values)
  const ownerAddresses = getAccountsFrom(values)

  const deploymentTxMethod = getSafeDeploymentTransaction(ownerAddresses, numConfirmations, userAccount)

  const promiEvent = deploymentTxMethod.send({ from: userAccount, value: 0 })

  promiEvent
    .once('transactionHash', hash => {
      saveToStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY, hash)
    })
    .then(async receipt => {
      await checkReceiptStatus(receipt.tx)

      const safeAddress = receipt.logs[0].args.proxy
      const safeContract = await getGnosisSafeInstanceAt(safeAddress)
      const safeProps = await buildSafe(safeAddress, name)
      const owners = getOwnersFrom(ownersNames, ownerAddresses)
      safeProps.owners = owners

      addSafe(safeProps)
      // if (stillInOpeningView()) {
      //   const url = {
      //     pathname: `${SAFELIST_ADDRESS}/${safeContract.address}/balances`,
      //     state: {
      //       name,
      //       tx: receipt.tx,
      //     },
      //   }

      //   history.push(url)
      // }

      removeFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)

      // returning info for testing purposes, in app is fully async
      return { safeAddress: safeContract.address, safeTx: receipt }
    })

  return promiEvent
}

const Open = ({ addSafe, /* location, */ network, provider, userAccount }: Props) => {
  // const [safeProps, setSafeProps] = useState(null)
  const [loading, setLoading] = useState(false)
  const [creatingTxPromise, setCreationTxPromise] = useState()
  const [creatingTxHash, setCreatingTxHash] = useState()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formValues, setFormValues] = useState()

  //------------------------------------------------
  // Check with Mikhail,
  // I think is is not being used.
  // at least, these params are not sent from the app
  // useEffect(() => {
  //   const query: SafePropsType = queryString.parse(location.search, { arrayFormat: 'comma' })
  //   const { name, owneraddresses, ownernames, threshold } = query

  //   if (validateQueryParams(owneraddresses, ownernames, threshold, name)) {
  //     setSafeProps({
  //       name,
  //       ownerAddresses: owneraddresses,
  //       ownerNames: ownernames,
  //       threshold,
  //     })
  //   }
  // }, [])

  useEffect(() => {
    const load = async () => {
      const pendingCreation = await loadFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)
      if (pendingCreation) {
        setCreatingTxHash(pendingCreation)
      }
      setLoading(false)
    }

    load()
  }, [])

  const createSafeProxy = (values = formValues) => {
    setFormValues(values)
    const promiEvent = createSafe(values, userAccount, addSafe)
    setCreationTxPromise(promiEvent)
    setIsSubmitted(true)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <Page>
      {isSubmitted ? (
        <Opening creatingTxHash={creatingTxHash} creatingTxPromise={creatingTxPromise} retry={createSafeProxy} />
      ) : (
        <Layout
          network={network}
          onCallSafeContractSubmit={createSafeProxy}
          provider={provider}
          // safeProps={safeProps}
          userAccount={userAccount}
        />
      )}
    </Page>
  )
}

export default connect(selector, actions)(withRouter(Open))
