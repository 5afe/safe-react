import { Loader } from '@gnosis.pm/safe-react-components'
import { backOff } from 'exponential-backoff'
import queryString from 'query-string'
import React, { useEffect, useState, ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { TransactionReceipt } from 'web3-core'

import { SafeDeployment } from 'src/routes/opening'
import { Layout } from 'src/routes/open/components/Layout'
import Page from 'src/components/layout/Page'
import { getSafeDeploymentTransaction } from 'src/logic/contracts/safeContracts'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'
import {
  CreateSafeValues,
  getAccountsFrom,
  getNamesFrom,
  getSafeCreationSaltFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from 'src/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS, WELCOME_ADDRESS } from 'src/routes/routes'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { history } from 'src/store'
import { loadFromStorage, removeFromStorage, saveToStorage } from 'src/utils/storage'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { sleep } from 'src/utils/timer'

const SAFE_PENDING_CREATION_STORAGE_KEY = 'SAFE_PENDING_CREATION_STORAGE_KEY'

type LoadedSafeType = CreateSafeValues & { txHash: string }

interface SafeCreationQueryParams {
  ownerAddresses: string | string[] | null
  ownerNames: string | string[] | null
  threshold: number | null
  safeName: string | null
}

export interface SafeProps {
  name: string
  ownerAddresses: string[]
  ownerNames: string[]
  threshold: string
}

const validateQueryParams = (queryParams: SafeCreationQueryParams): boolean => {
  const { ownerAddresses, ownerNames, threshold, safeName } = queryParams

  if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
    return false
  }

  if (Number.isNaN(threshold)) {
    return false
  }

  return threshold > 0 && threshold <= ownerAddresses.length
}

const getSafePropsValuesFromQueryParams = (queryParams: SafeCreationQueryParams): SafeProps | undefined => {
  if (!validateQueryParams(queryParams)) {
    return
  }

  const { threshold, safeName, ownerAddresses, ownerNames } = queryParams

  return {
    name: safeName as string,
    threshold: (threshold as number).toString(),
    ownerAddresses: Array.isArray(ownerAddresses) ? ownerAddresses : [ownerAddresses as string],
    ownerNames: Array.isArray(ownerNames) ? ownerNames : [ownerNames as string],
  }
}

export const createSafe = async (values: CreateSafeValues, userAccount: string): Promise<TransactionReceipt> => {
  const confirmations = getThresholdFrom(values)
  const ownerAddresses = getAccountsFrom(values)
  const safeCreationSalt = getSafeCreationSaltFrom(values)
  const deploymentTx = getSafeDeploymentTransaction(ownerAddresses, confirmations, safeCreationSalt)

  const receipt = await deploymentTx
    .send({
      from: userAccount,
      gas: values?.gasLimit,
    })
    .once('transactionHash', (txHash) => {
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, { txHash, ...values })
    })

  return receipt
}

const Open = (): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [creationTxPromise, setCreationTxPromise] = useState<Promise<TransactionReceipt>>()
  const [safeCreationPendingInfo, setSafeCreationPendingInfo] = useState<{ txHash?: string } | undefined>()
  const [safePropsFromUrl, setSafePropsFromUrl] = useState<SafeProps | undefined>()
  const userAccount = useSelector(userAccountSelector)
  const dispatch = useDispatch()
  const location = useLocation()
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // #122: Allow to migrate an old Multisig by passing the parameters to the URL.
    const query = queryString.parse(location.search, { arrayFormat: 'comma' })
    const { name, owneraddresses, ownernames, threshold } = query

    const safeProps = getSafePropsValuesFromQueryParams({
      ownerAddresses: owneraddresses,
      ownerNames: ownernames,
      threshold: Number(threshold),
      safeName: name as string | null,
    })

    setSafePropsFromUrl(safeProps)
  }, [location])

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

  const createSafeProxy = async (formValues?: CreateSafeValues) => {
    let values = formValues

    // save form values, used when the user rejects the TX and wants to retry
    if (values) {
      const copy = { ...values }
      saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, copy)
    } else {
      values = (await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)) as CreateSafeValues
    }

    const receiptPromise = createSafe(values, userAccount)
    setCreationTxPromise(receiptPromise)
    setShowProgress(true)
  }

  const onSafeCreated = async (safeAddress: string): Promise<void> => {
    const pendingCreation = await loadFromStorage<LoadedSafeType>(SAFE_PENDING_CREATION_STORAGE_KEY)

    let name = ''
    let ownersNames: string[] = []
    let ownersAddresses: string[] = []

    if (pendingCreation) {
      name = getSafeNameFrom(pendingCreation)
      ownersNames = getNamesFrom(pendingCreation as CreateSafeValues)
      ownersAddresses = getAccountsFrom(pendingCreation)
    }

    const owners = ownersAddresses.map((address, index) => makeAddressBookEntry({ address, name: ownersNames[index] }))
    const safe = makeAddressBookEntry({ address: safeAddress, name })
    await dispatch(addressBookSafeLoad([...owners, safe]))

    const safeProps = await buildSafe(safeAddress)
    await dispatch(addOrUpdateSafe(safeProps))

    trackEvent({
      category: 'User',
      action: 'Created a safe',
    })

    // a default 5s wait before starting to request safe information
    await sleep(5000)

    await backOff(() => getSafeInfo(safeAddress), {
      startingDelay: 750,
      retry: (e) => {
        console.info('waiting for client-gateway to provide safe information', e)
        return true
      },
    })

    await removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
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
    const values = await loadFromStorage<{ txHash?: string }>(SAFE_PENDING_CREATION_STORAGE_KEY)
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
        <SafeDeployment
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
