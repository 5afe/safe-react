import { ReactElement, useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { backOff } from 'exponential-backoff'
import { TransactionReceipt } from 'web3-core'
import { GenericModal } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import { getSafeDeploymentTransaction } from 'src/logic/contracts/safeContracts'
import { txMonitor } from 'src/logic/safe/transactions/txMonitor'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { SafeDeployment } from 'src/routes/opening'
import { useAnalytics, USER_EVENTS } from 'src/utils/googleAnalytics'
import { loadFromStorage, removeFromStorage, saveToStorage } from 'src/utils/storage'
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
  FIELD_NEW_SAFE_PROXY_SALT,
  FIELD_NEW_SAFE_GAS_PRICE,
} from '../fields/createSafeFields'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import Paragraph from 'src/components/layout/Paragraph'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import Button from 'src/components/layout/Button'
import { boldFont } from 'src/theme/variables'
import { WELCOME_ROUTE, history, generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { getExplorerInfo, getShortName } from 'src/config'
import { getGasParam } from 'src/logic/safe/transactions/gas'
import { currentChainId } from 'src/logic/config/store/selectors'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

export const InlinePrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  display: inline-flex;
`

type ModalDataType = {
  safeAddress: string
  safeName?: string
  safeCreationTxHash?: string
}

const goToWelcomePage = () => {
  history.push(WELCOME_ROUTE)
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

function SafeCreationProcess(): ReactElement {
  const [safeCreationTxHash, setSafeCreationTxHash] = useState<string | undefined>()
  const [creationTxPromise, setCreationTxPromise] = useState<Promise<TransactionReceipt>>()

  const { trackEvent } = useAnalytics()
  const dispatch = useDispatch()
  const userAddressAccount = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)

  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<ModalDataType>({ safeAddress: '' })
  const [showCouldNotLoadModal, setShowCouldNotLoadModal] = useState(false)
  const [newSafeAddress, setNewSafeAddress] = useState<string>('')

  const createNewSafe = useCallback(() => {
    const safeCreationFormValues = loadFromStorage<CreateSafeFormValues>(SAFE_PENDING_CREATION_STORAGE_KEY)

    if (!safeCreationFormValues) {
      goToWelcomePage()
      return
    }

    setSafeCreationTxHash(safeCreationFormValues[FIELD_NEW_SAFE_CREATION_TX_HASH])

    setCreationTxPromise(
      new Promise((resolve, reject) => {
        const confirmations = safeCreationFormValues[FIELD_NEW_SAFE_THRESHOLD]
        const ownerFields = safeCreationFormValues[FIELD_SAFE_OWNERS_LIST]
        const ownerAddresses = ownerFields.map(({ addressFieldName }) => safeCreationFormValues[addressFieldName])
        const safeCreationSalt = safeCreationFormValues[FIELD_NEW_SAFE_PROXY_SALT]
        const gasLimit = safeCreationFormValues[FIELD_NEW_SAFE_GAS_LIMIT]
        const gasPrice = safeCreationFormValues[FIELD_NEW_SAFE_GAS_PRICE]
        const deploymentTx = getSafeDeploymentTransaction(ownerAddresses, confirmations, safeCreationSalt)

        deploymentTx
          .send({
            from: userAddressAccount,
            gas: gasLimit,
            [getGasParam()]: gasPrice,
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
    const safeCreationFormValues = loadFromStorage<CreateSafeFormValues>(SAFE_PENDING_CREATION_STORAGE_KEY)
    if (!safeCreationFormValues) {
      goToWelcomePage()
      return
    }

    const safeCreationTxHash = safeCreationFormValues[FIELD_NEW_SAFE_CREATION_TX_HASH]
    if (safeCreationTxHash) {
      setSafeCreationTxHash(safeCreationTxHash)
    } else {
      createNewSafe()
    }
  }, [createNewSafe])

  const onSafeCreated = async (newSafeAddress: string): Promise<void> => {
    const createSafeFormValues = loadFromStorage<CreateSafeFormValues>(SAFE_PENDING_CREATION_STORAGE_KEY)

    if (!createSafeFormValues) {
      goToWelcomePage()
      return
    }

    const safeCreationTxHash = createSafeFormValues[FIELD_NEW_SAFE_CREATION_TX_HASH]
    const defaultSafeValue = createSafeFormValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]
    const safeName = createSafeFormValues[FIELD_CREATE_CUSTOM_SAFE_NAME] || defaultSafeValue
    const owners = createSafeFormValues[FIELD_SAFE_OWNERS_LIST]

    // we update the address book with the owners and the new safe
    const ownersAddressBookEntry = owners.map(({ nameFieldName, addressFieldName }) =>
      makeAddressBookEntry({
        address: createSafeFormValues[addressFieldName],
        name: createSafeFormValues[nameFieldName],
        chainId,
      }),
    )
    const safeAddressBookEntry = makeAddressBookEntry({ address: newSafeAddress, name: safeName, chainId })
    await dispatch(addressBookSafeLoad([...ownersAddressBookEntry, safeAddressBookEntry]))

    trackEvent(USER_EVENTS.CREATE_SAFE)

    // a default 5s wait before starting to request safe information
    await sleep(5000)

    try {
      // exponential delay between attempts for around 4 min
      await backOff(() => getSafeInfo(newSafeAddress), {
        startingDelay: 750,
        maxDelay: 20000,
        numOfAttempts: 19,
        retry: (e) => {
          console.info('waiting for client-gateway to provide safe information', e)
          return true
        },
      })
    } catch (e) {
      setNewSafeAddress(newSafeAddress)
      setShowCouldNotLoadModal(true)
      return
    }

    const safeProps = await buildSafe(newSafeAddress)
    await dispatch(addOrUpdateSafe(safeProps))

    setShowModal(true)
    setModalData({
      safeAddress: safeProps.address,
      safeName,
      safeCreationTxHash,
    })
  }

  const onRetry = (): void => {
    const safeCreationFormValues = loadFromStorage<CreateSafeFormValues>(SAFE_PENDING_CREATION_STORAGE_KEY)

    if (!safeCreationFormValues) {
      goToWelcomePage()
      return
    }

    setSafeCreationTxHash(undefined)
    delete safeCreationFormValues.safeCreationTxHash
    saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, safeCreationFormValues)
    createNewSafe()
  }

  const onCancel = () => {
    removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)
    goToWelcomePage()
  }

  function onClickModalButton() {
    removeFromStorage(SAFE_PENDING_CREATION_STORAGE_KEY)

    const { safeName, safeCreationTxHash, safeAddress } = modalData
    history.push({
      pathname: generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
        shortName: getShortName(),
        safeAddress,
      }),
      state: {
        name: safeName,
        tx: safeCreationTxHash,
      },
    })
  }

  return (
    <>
      <SafeDeployment
        creationTxHash={safeCreationTxHash}
        onCancel={onCancel}
        onRetry={onRetry}
        onSuccess={onSafeCreated}
        submittedPromise={creationTxPromise}
      />
      {showModal && (
        <GenericModal
          onClose={onClickModalButton}
          title="Safe Created!"
          body={
            <div data-testid="safe-created-popup">
              <Paragraph>
                You just created a new Safe on <NetworkLabel />
              </Paragraph>
              <Paragraph>
                You will only be able to use this Safe on <NetworkLabel />
              </Paragraph>
              <Paragraph>
                If you send assets on other networks to this address,{' '}
                <EmphasisLabel>you will not be able to access them</EmphasisLabel>
              </Paragraph>
            </div>
          }
          footer={
            <ButtonContainer>
              <Button
                testId="safe-created-button"
                onClick={onClickModalButton}
                color="primary"
                type={'button'}
                size="small"
                variant="contained"
              >
                Continue
              </Button>
            </ButtonContainer>
          }
        />
      )}
      {showCouldNotLoadModal && newSafeAddress && (
        <GenericModal
          onClose={onCancel}
          title="Unable to load the new Safe"
          body={
            <div>
              <Paragraph>
                We are currently unable to load the Safe but it was successfully created and can be found <br />
                under the following address{' '}
                <InlinePrefixedEthHashInfo
                  hash={newSafeAddress}
                  showCopyBtn
                  explorerUrl={getExplorerInfo(newSafeAddress)}
                />
              </Paragraph>
            </div>
          }
          footer={
            <ButtonContainer>
              <Button onClick={onCancel} color="primary" type="button" size="small" variant="contained">
                OK
              </Button>
            </ButtonContainer>
          }
        />
      )}
    </>
  )
}

export default SafeCreationProcess

const ButtonContainer = styled.div`
  text-align: center;
`

const EmphasisLabel = styled.span`
  font-weight: ${boldFont};
`
