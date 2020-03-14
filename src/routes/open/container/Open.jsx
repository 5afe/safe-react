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
import { /* getGnosisSafeInstanceAt, */ getSafeDeploymentTransaction } from '~/logic/contracts/safeContracts'
import { checkReceiptStatus } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import {
  getAccountsFrom,
  getNamesFrom,
  getOwnersFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from '~/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS /* , OPENING_ADDRESS, stillInOpeningView */ } from '~/routes/routes'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { history } from '~/store'
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

export const getSafeProps = async (safeAddress, safeName, ownersNames, ownerAddresses) => {
  const safeProps = await buildSafe(safeAddress, safeName)
  const owners = getOwnersFrom(ownersNames, ownerAddresses)
  safeProps.owners = owners

  return safeProps
}

export const createSafe = (values: Object, userAccount: string, addSafe: AddSafe): Promise<OpenState> => {
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const ownersNames = getNamesFrom(values)
  const ownerAddresses = getAccountsFrom(values)

  const deploymentTxMethod = getSafeDeploymentTransaction(ownerAddresses, numConfirmations, userAccount)

  const promiEvent = deploymentTxMethod.send({ from: userAccount, value: 0 })

  promiEvent
    .once('transactionHash', txHash => {
      saveToStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY, { txHash, name, ownerAddresses, ownersNames })
    })
    .then(async receipt => {
      //-------------------------------
      // check if this is really needed
      await checkReceiptStatus(receipt.transactionHash)

      const safeAddress = receipt.events.ProxyCreation.address
      const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)

      // returning info for testing purposes, in app is fully async
      return { safeAddress: safeProps.address, safeTx: receipt }
    })
    .catch(error => {
      debugger
      console.log(error)
    })

  return promiEvent
}

const Open = ({ addSafe, /* location, */ network, provider, userAccount }: Props) => {
  // const [safeProps, setSafeProps] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState()
  const [creationTxPromise, setCreationTxPromise] = useState()
  const [safeCreationPendingInfo, setSafeCreationPendingInfo] = useState()
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

  // check if there is a safe being created
  useEffect(() => {
    const load = async () => {
      const pendingCreation = await loadFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)
      if (pendingCreation) {
        setSafeCreationPendingInfo(pendingCreation)
        setShowProgress(true)
      } else {
        setShowProgress(false)
      }
      setLoading(false)
    }

    load()
  }, [])

  const createSafeProxy = (values = formValues) => {
    setFormValues(values)
    const promiEvent = createSafe(values, userAccount, addSafe)
    setCreationTxPromise(promiEvent)
    setShowProgress(true)
  }

  const onSafeCreated = async () => {
    const web3 = getWeb3()
    //let safeProps
    //let receipt

    // if (formValues) {
    //   const name = getSafeNameFrom(formValues)
    //   const ownersNames = getNamesFrom(formValues)
    //   const ownerAddresses = getAccountsFrom(formValues)
    //   receipt = await creationTxPromise
    //   safeProps = getSafeProps(receipt, name, ownersNames, ownerAddresses)
    //   addSafe(safeProps)
    // } else {
    const pendingCreation = await loadFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)
    const receipt = await web3.eth.getTransactionReceipt(pendingCreation.txHash)

    // get the address for the just created safe
    const events = web3.eth.abi.decodeLog(
      [
        {
          type: 'address',
          name: 'ProxyCreation',
        },
      ],
      receipt.logs[0].data,
      receipt.logs[0].topics,
    )

    const safeAddress = events[0]

    const safeProps = await getSafeProps(
      safeAddress,
      safeCreationPendingInfo.name,
      safeCreationPendingInfo.ownersNames,
      safeCreationPendingInfo.ownerAddresses,
    )
    addSafe(safeProps)

    removeFromStorage(SAFE_PENDING_CREATION_HASH_STORAGE_KEY)
    const url = {
      pathname: `${SAFELIST_ADDRESS}/${safeProps.address}/balances`,
      state: {
        name,
        tx: safeCreationPendingInfo.txHash,
      },
    }

    history.push(url)
  }

  if (loading || showProgress === undefined) {
    return <Loader />
  }

  return (
    <Page>
      {showProgress ? (
        <Opening
          creationTxHash={safeCreationPendingInfo ? safeCreationPendingInfo.txHash : undefined}
          onRetry={createSafeProxy}
          onSuccess={onSafeCreated}
          submittedPromise={creationTxPromise}
        />
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
