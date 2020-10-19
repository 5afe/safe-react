import { Loader } from '@gnosis.pm/safe-react-components'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { useDispatch, useSelector } from 'react-redux'
import Opening from 'src/routes/opening'
import Layout from 'src/routes/open/components/Layout'
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
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { history } from 'src/store'
import { loadFromStorage, removeFromStorage, saveToStorage } from 'src/utils/storage'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { PromiEvent, TransactionReceipt } from 'web3-core'

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
  return threshold <= ownerAddresses.length
}

export const getSafeProps = async (
  safeAddress: string,
  safeName: string,
  ownersNames: string[],
  ownerAddresses: string[],
): Promise<SafeRecordProps> => {
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

  const deploymentTx = getSafeDeploymentTransaction(ownerAddresses, confirmations)

  const promiEvent = deploymentTx.send({ from: userAccount })

  promiEvent
    .once('transactionHash', (txHash) => {
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, { txHash, ...values })
    })
    .then(async (receipt) => {
      await checkReceiptStatus(receipt.transactionHash)
      const safeAddress = receipt.events?.ProxyCreation.returnValues.proxy
      const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)
      // returning info for testing purposes, in app is fully async
      return { safeAddress: safeProps.address, safeTx: receipt }
    })
    .catch((error) => {
      console.error(error)
    })

  return promiEvent
}

const Open = (): React.ReactElement => {
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [creationTxPromise, setCreationTxPromise] = useState<PromiEvent<TransactionReceipt>>()
  const [safeCreationPendingInfo, setSafeCreationPendingInfo] = useState<any>()
  const [safePropsFromUrl, setSafePropsFromUrl] = useState()
  const userAccount = useSelector(userAccountSelector)
  const dispatch = useDispatch()

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

  const onSafeCreated = async (safeAddress): Promise<void> => {
    const pendingCreation = await loadFromStorage<{ txHash: string }>(SAFE_PENDING_CREATION_STORAGE_KEY)

    const name = getSafeNameFrom(pendingCreation)
    const ownersNames = getNamesFrom(pendingCreation)
    const ownerAddresses = getAccountsFrom(pendingCreation)
    const safeProps = await getSafeProps(safeAddress, name, ownersNames, ownerAddresses)

    await dispatch(addOrUpdateSafe(safeProps))

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
        tx: pendingCreation?.txHash,
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
    delete values?.txHash
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
          onSuccess={onSafeCreated}
          submittedPromise={creationTxPromise}
        />
      ) : (
        <Layout onCallSafeContractSubmit={createSafeProxy} safeProps={safePropsFromUrl} />
      )}
    </Page>
  )
}

export default Open
