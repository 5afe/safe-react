import React, { ReactElement, useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { backOff } from 'exponential-backoff'
import { TransactionReceipt } from 'web3-core'

import { getSafeDeploymentTransaction } from 'src/logic/contracts/safeContracts'
import { txMonitor } from 'src/logic/safe/transactions/txMonitor'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { FIELD_CREATION_PROXY_SALT } from 'src/routes/open/components/fields'
import { SafeDeployment } from 'src/routes/opening'
import { SAFE_ROUTES, WELCOME_ADDRESS } from 'src/routes/routes'
import { history } from 'src/store'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { loadFromStorage, removeFromStorage, saveToStorage } from 'src/utils/storage'
import { sleep } from 'src/utils/timer'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import {
  SAFE_PENDING_CREATION_STORAGE_KEY,
  CreateSafeFormValues,
  FIELD_NEW_SAFE_THRESHOLD,
  FIELD_SAFE_OWNERS_LIST,
  FIELD_NEW_SAFE_GAS_LIMIT,
  FIELD_NEW_SAFE_CREATION_TX_HASH,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_CREATE_CUSTOM_SAFE_NAME,
} from '../fields/createSafeFields'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { generatePath } from 'react-router'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'

function SafeCreationProcess(): ReactElement {
  const [safeCreationTxHash, setSafeCreationTxHash] = useState<string | undefined>()
  const [creationTxPromise, setCreationTxPromise] = useState<Promise<TransactionReceipt>>()

  const { trackEvent } = useAnalytics()
  const dispatch = useDispatch()
  const userAddressAccount = useSelector(userAccountSelector)

  const createNewSafe = useCallback(async () => {
    const safeCreationFormValues = (await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)) as CreateSafeFormValues
    setSafeCreationTxHash(safeCreationFormValues[FIELD_NEW_SAFE_CREATION_TX_HASH])

    setCreationTxPromise(
      new Promise((resolve, reject) => {
        const confirmations = safeCreationFormValues[FIELD_NEW_SAFE_THRESHOLD]
        const ownerFields = safeCreationFormValues[FIELD_SAFE_OWNERS_LIST]
        const ownerAddresses = ownerFields.map(({ addressFieldName }) => safeCreationFormValues[addressFieldName])
        const safeCreationSalt = safeCreationFormValues[FIELD_CREATION_PROXY_SALT]
        const gasLimit = safeCreationFormValues[FIELD_NEW_SAFE_GAS_LIMIT]
        const deploymentTx = getSafeDeploymentTransaction(ownerAddresses, confirmations, safeCreationSalt)

        deploymentTx
          .send({
            from: userAddressAccount,
            gas: gasLimit,
          })
          .once('transactionHash', (txHash) => {
            saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, {
              [FIELD_NEW_SAFE_CREATION_TX_HASH]: txHash,
              ...safeCreationFormValues,
            })

            // Monitor the latest block to find a potential speed-up tx
            txMonitor({ sender: userAddressAccount, hash: txHash, data: deploymentTx.encodeABI() })
              .then((txReceipt) => {
                console.log('Speed up tx mined:', txReceipt)
                resolve(txReceipt)
              })
              .catch((error) => {
                reject(error)
              })
          })
          .then((txReceipt) => {
            console.log('First tx mined:', txReceipt)
            resolve(txReceipt)
          })
          .catch((error) => {
            reject(error)
          })
      }),
    )
  }, [userAddressAccount])

  useEffect(() => {
    const load = async () => {
      const safeCreationFormValues = (await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)) as CreateSafeFormValues
      const safeCreationTxHash = safeCreationFormValues[FIELD_NEW_SAFE_CREATION_TX_HASH]
      if (safeCreationTxHash) {
        setSafeCreationTxHash(safeCreationTxHash)
      } else {
        createNewSafe()
      }
    }

    load()
  }, [createNewSafe])

  const onSafeCreated = async (newSafeAddress: string): Promise<void> => {
    const createSafeFormValues = (await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)) as CreateSafeFormValues
    const safeCreationTxHash = createSafeFormValues[FIELD_NEW_SAFE_CREATION_TX_HASH]
    const defaultSafeValue = createSafeFormValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]
    const safeName = createSafeFormValues[FIELD_CREATE_CUSTOM_SAFE_NAME] || defaultSafeValue
    const owners = createSafeFormValues[FIELD_SAFE_OWNERS_LIST]

    // we update the address book with the owners and the new safe
    const ownersAddressBookEntry = owners.map(({ nameFieldName, addressFieldName }) =>
      makeAddressBookEntry({
        address: createSafeFormValues[addressFieldName],
        name: createSafeFormValues[nameFieldName],
      }),
    )
    const safeAddressBookEntry = makeAddressBookEntry({ address: newSafeAddress, name: safeName })
    await dispatch(addressBookSafeLoad([...ownersAddressBookEntry, safeAddressBookEntry]))

    trackEvent({
      category: 'User',
      action: 'Created a safe',
    })

    // a default 5s wait before starting to request safe information
    await sleep(5000)

    await backOff(() => getSafeInfo(newSafeAddress), {
      startingDelay: 750,
      retry: (e) => {
        console.info('waiting for client-gateway to provide safe information', e)
        return true
      },
    })

    const safeProps = await buildSafe(newSafeAddress)
    await dispatch(addOrUpdateSafe(safeProps))

    await removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)

    const url = {
      pathname: generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
        safeAddress: safeProps.address,
      }),
      state: {
        name: safeName,
        tx: safeCreationTxHash,
      },
    }

    history.push(url)
  }

  const onRetry = async () => {
    const safeCreationFormValues = (await loadFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)) as CreateSafeFormValues
    setSafeCreationTxHash(undefined)
    delete safeCreationFormValues.safeCreationTxHash
    await saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, safeCreationFormValues)
    createNewSafe()
  }

  const onCancel = () => {
    removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    history.push({
      pathname: `${WELCOME_ADDRESS}`,
    })
  }

  return (
    <SafeDeployment
      creationTxHash={safeCreationTxHash}
      onCancel={onCancel}
      onRetry={onRetry}
      onSuccess={onSafeCreated}
      submittedPromise={creationTxPromise}
    />
  )
}

export default SafeCreationProcess
