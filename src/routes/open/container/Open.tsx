import { Loader } from '@gnosis.pm/safe-react-components'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Opening from '../../opening'
import Layout from '../components/Layout'

import actions from './actions'
import selector from './selector'

import Page from 'src/components/layout/Page'
import { getSafeDeploymentTransaction } from 'src/logic/contracts/safeContracts'
import { checkReceiptStatus } from 'src/logic/wallets/ethTransactions'
import {
  getAccountsFrom,
  getNamesFrom,
  getOwnersFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from 'src/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS, WELCOME_ADDRESS } from 'src/routes/routes'
import { buildSafe } from 'src/routes/safe/store/actions/fetchSafe'
import { history } from 'src/store'
import { loadFromStorage, removeFromStorage, saveToStorage } from 'src/utils/storage'

const SAFE_PENDING_CREATION_STORAGE_KEY = 'SAFE_PENDING_CREATION_STORAGE_KEY'

const validateQueryParams = (ownerAddresses, ownerNames, threshold, safeName) => {
  if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
    return false
  }
  if (!ownerAddresses.length || ownerNames.length === 0) {
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

export const createSafe = (values, userAccount) => {
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
    .catch((error) => {
      console.error(error)
    })

  return promiEvent
}

const Open = ({ addSafe, network, provider, userAccount }) => {
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [creationTxPromise, setCreationTxPromise] = useState()
  const [safeCreationPendingInfo, setSafeCreationPendingInfo] = useState<any>()
  const [safePropsFromUrl, setSafePropsFromUrl] = useState()

  useEffect(() => {
    // #122: Allow to migrate an old Multisig by passing the parameters to the URL.
    const query = queryString.parse(window.location.search, { arrayFormat: 'comma' })
    const { name, owneraddresses, ownernames, threshold } = query
    if (validateQueryParams(owneraddresses, ownernames, threshold, name)) {
      setSafePropsFromUrl({
        name,
        ownerAddresses: owneraddresses,
        ownerNames: ownernames,
        threshold,
      } as any)
    }
  }, [])

  // check if there is a safe being created
  useEffect(() => {
    const load = async () => {
      const pendingCreation = await loadFromStorage<{ txHash: string }>(SAFE_PENDING_CREATION_STORAGE_KEY)
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

  const createSafeProxy = async (formValues?: any) => {
    let values = formValues

    // save form values, used when the user rejects the TX and wants to retry
    if (formValues) {
      const copy = { ...formValues }
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, copy)
    } else {
      values = await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    }

    const promiEvent = createSafe(values, userAccount)
    setCreationTxPromise(promiEvent)
    setShowProgress(true)
  }

  const onSafeCreated = async (safeAddress) => {
    const pendingCreation = await loadFromStorage<{ txHash: string }>(SAFE_PENDING_CREATION_STORAGE_KEY)

    const name = getSafeNameFrom(pendingCreation)
    const ownersNames = getNamesFrom(pendingCreation)
    const ownerAddresses = getAccountsFrom(pendingCreation)
    const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)
    addSafe(safeProps)

    ReactGA.event({
      category: 'User',
      action: 'Created a safe',
      value: safeAddress,
    })

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
    const values = await loadFromStorage<{ txHash: string }>(SAFE_PENDING_CREATION_STORAGE_KEY)
    delete values.txHash
    await saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, values)
    setSafeCreationPendingInfo(values)
    createSafeProxy()
  }

  if (loading || showProgress === undefined) {
    return <Loader size="md" />
  }

  return (
    <Page>
      {showProgress ? (
        <Opening
          creationTxHash={safeCreationPendingInfo?.txHash}
          onCancel={onCancel}
          onRetry={onRetry}
          onSuccess={onSafeCreated as any}
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
