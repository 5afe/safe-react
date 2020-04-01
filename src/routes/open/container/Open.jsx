// @flow
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Opening from '../../opening'
import Layout from '../components/Layout'

import actions, { type Actions } from './actions'
import selector from './selector'

import { Loader } from '~/components-v2'
import Page from '~/components/layout/Page'
import { getSafeDeploymentTransaction } from '~/logic/contracts/safeContracts'
import { checkReceiptStatus } from '~/logic/wallets/ethTransactions'
import {
  getAccountsFrom,
  getNamesFrom,
  getOwnersFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from '~/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS, WELCOME_ADDRESS } from '~/routes/routes'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { history } from '~/store'
import { loadFromStorage, removeFromStorage, saveToStorage } from '~/utils/storage'

const SAFE_PENDING_CREATION_STORAGE_KEY = 'SAFE_PENDING_CREATION_STORAGE_KEY'

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

const validateQueryParams = (
  ownerAddresses?: string[],
  ownerNames?: string[],
  threshold?: string,
  safeName?: string,
) => {
  if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
    return false
  }
  if (!ownerAddresses.length === 0 || ownerNames.length === 0) {
    return false
  }

  if (Number.isNaN(Number(threshold))) {
    return false
  }
  if (threshold > ownerAddresses.length) {
    return false
  }
  return true
}

export const getSafeProps = async (safeAddress, safeName, ownersNames, ownerAddresses) => {
  const safeProps = await buildSafe(safeAddress, safeName)
  const owners = getOwnersFrom(ownersNames, ownerAddresses)
  safeProps.owners = owners

  return safeProps
}

export const createSafe = (values: Object, userAccount: string): Promise<OpenState> => {
  const confirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const ownersNames = getNamesFrom(values)
  const ownerAddresses = getAccountsFrom(values)

  const deploymentTxMethod = getSafeDeploymentTransaction(ownerAddresses, confirmations, userAccount)

  const promiEvent = deploymentTxMethod.send({ from: userAccount, value: 0 })

  promiEvent
    .once('transactionHash', (txHash) => {
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, { txHash, ...values })
    })
    .then(async (receipt) => {
      await checkReceiptStatus(receipt.transactionHash)

      const safeAddress = receipt.events.ProxyCreation.returnValues.proxy
      const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)
      // returning info for testing purposes, in app is fully async
      return { safeAddress: safeProps.address, safeTx: receipt }
    })

  return promiEvent
}

const Open = ({ addSafe, network, provider, userAccount }: Props) => {
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState()
  const [creationTxPromise, setCreationTxPromise] = useState()
  const [safeCreationPendingInfo, setSafeCreationPendingInfo] = useState()
  const [safePropsFromUrl, setSafePropsFromUrl] = useState()

  useEffect(() => {
    // #122: Allow to migrate an old Multisig by passing the parameters to the URL.
    const query: SafePropsType = queryString.parse(location.search, { arrayFormat: 'comma' })
    const { name, owneraddresses, ownernames, threshold } = query
    if (validateQueryParams(owneraddresses, ownernames, threshold, name)) {
      setSafePropsFromUrl({
        name,
        ownerAddresses: owneraddresses,
        ownerNames: ownernames,
        threshold,
      })
    }
  })

  // check if there is a safe being created
  useEffect(() => {
    const load = async () => {
      const pendingCreation = await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
      if (pendingCreation && pendingCreation.txHash) {
        setSafeCreationPendingInfo(pendingCreation)
        setShowProgress(true)
      } else {
        setShowProgress(false)
      }
      setLoading(false)
    }

    load()
  }, [])

  const createSafeProxy = async (formValues) => {
    let values = formValues

    // save form values, used when the user rejects the TX and wants to retry
    if (formValues) {
      const copy = { ...formValues }
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, copy)
    } else {
      values = await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    }

    const promiEvent = createSafe(values, userAccount, addSafe)
    setCreationTxPromise(promiEvent)
    setShowProgress(true)
  }

  const onSafeCreated = async (safeAddress) => {
    const pendingCreation = await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)

    const name = getSafeNameFrom(pendingCreation)
    const ownersNames = getNamesFrom(pendingCreation)
    const ownerAddresses = getAccountsFrom(pendingCreation)
    const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)
    addSafe(safeProps)

    removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    const url = {
      pathname: `${SAFELIST_ADDRESS}/${safeProps.address}/balances`,
      state: {
        name,
        tx: pendingCreation.txHash,
      },
    }

    history.push(url)
  }

  const onCancel = () => {
    removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    history.push({
      pathname: `${WELCOME_ADDRESS}`,
    })
  }

  const onRetry = async () => {
    const values = await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    delete values.txHash
    await saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, values)
    setSafeCreationPendingInfo(values)
    createSafeProxy()
  }

  if (loading || showProgress === undefined) {
    return <Loader />
  }

  return (
    <Page>
      {showProgress ? (
        <Opening
          creationTxHash={safeCreationPendingInfo ? safeCreationPendingInfo.txHash : undefined}
          onCancel={onCancel}
          onRetry={onRetry}
          onSuccess={onSafeCreated}
          provider={provider}
          submittedPromise={creationTxPromise}
        />
      ) : (
        <Layout
          network={network}
          onCallSafeContractSubmit={createSafeProxy}
          provider={provider}
          safeProps={safePropsFromUrl}
          userAccount={userAccount}
        />
      )}
    </Page>
  )
}

export default connect(selector, actions)(withRouter(Open))
