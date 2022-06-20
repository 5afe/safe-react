import { Loader, Stepper } from '@gnosis.pm/safe-react-components'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { ErrorFooter } from 'src/routes/opening/components/Footer'
import { isConfirmationStep, steps } from './steps'

import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3ReadOnly, isTxPendingError } from 'src/logic/wallets/getWeb3'
import { background, connected, fontColor } from 'src/theme/variables'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'

import SuccessSvg from 'src/assets/icons/safe-created.svg'
import VaultErrorSvg from './assets/vault-error.svg'
import VaultLoading from './assets/creation-process.gif'
import { TransactionReceipt } from 'web3-core'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { NOTIFICATIONS } from 'src/logic/notifications'
import { showNotification } from 'src/logic/notifications/store/notifications'
import { getNewSafeAddressFromLogs } from 'src/routes/opening/utils/getSafeAddressFromLogs'
import { getExplorerInfo } from 'src/config'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { trackEvent } from 'src/utils/googleTagManager'
import { CREATE_SAFE_EVENTS } from 'src/utils/events/createLoadSafe'
import { isWalletRejection } from 'src/logic/wallets/errors'

export const SafeDeployment = ({
  creationTxHash,
  onCancel,
  onRetry,
  onSuccess,
  submittedPromise,
}: Props): React.ReactElement => {
  const [loading, setLoading] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [safeCreationTxHash, setSafeCreationTxHash] = useState('')
  const [createdSafeAddress, setCreatedSafeAddress] = useState('')

  const [error, setError] = useState(false)
  const [intervalStarted, setIntervalStarted] = useState(false)
  const [waitingSafeDeployed, setWaitingSafeDeployed] = useState(false)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false)
  const provider = useSelector(providerNameSelector)
  const dispatch = useDispatch()

  const confirmationStep = isConfirmationStep(stepIndex)

  const navigateToSafe = () => {
    setContinueButtonDisabled(true)
    onSuccess(createdSafeAddress)
  }

  const showSnackbarError = useCallback(
    (err: Error) => {
      if (isTxPendingError(err)) {
        dispatch(showNotification(NOTIFICATIONS.TX_PENDING_MSG))
      } else {
        dispatch(
          showNotification({
            ...NOTIFICATIONS.CREATE_SAFE_FAILED_MSG,
            message: `${NOTIFICATIONS.CREATE_SAFE_FAILED_MSG.message} – ${err.message}`,
          }),
        )
      }
    },
    [dispatch],
  )

  const onError = useCallback(
    (error: Error) => {
      setIntervalStarted(false)
      setWaitingSafeDeployed(false)
      setContinueButtonDisabled(false)
      setError(true)
      logError(Errors._800, error.message)
      showSnackbarError(error)
    },
    [setIntervalStarted, setWaitingSafeDeployed, setContinueButtonDisabled, setError, showSnackbarError],
  )

  // discard click event value
  const onRetryTx = () => {
    setStepIndex(0)
    setError(false)
    onRetry()
  }

  const getImage = () => {
    if (error) {
      return VaultErrorSvg
    }

    if (stepIndex <= 4) {
      return VaultLoading
    }

    return SuccessSvg
  }

  useEffect(() => {
    if (provider) {
      setLoading(false)
    }
  }, [provider])

  // creating safe from form submission
  useEffect(() => {
    if (submittedPromise === undefined) {
      return
    }

    const handlePromise = async () => {
      setStepIndex(0)
      try {
        const receipt = await submittedPromise
        setSafeCreationTxHash(receipt.transactionHash)
        setStepIndex(1)
        setIntervalStarted(true)
      } catch (err) {
        if (isWalletRejection(err)) {
          trackEvent(CREATE_SAFE_EVENTS.REJECT_CREATE_SAFE)
        }
        onError(err)
      }
    }

    handlePromise()
  }, [submittedPromise, onError])

  // recovering safe creation from txHash
  useEffect(() => {
    if (creationTxHash === undefined) {
      return
    }
    setSafeCreationTxHash(creationTxHash)
    setStepIndex(1)
    setIntervalStarted(true)
  }, [creationTxHash])

  useEffect(() => {
    if (!intervalStarted) {
      return
    }

    const isTxMined = async (txHash: string) => {
      const web3 = getWeb3ReadOnly()

      const txResult = await web3.eth.getTransaction(txHash)
      if (txResult?.blockNumber == null) {
        return false
      }

      const receipt = await web3.eth.getTransactionReceipt(txHash)
      if (!receipt?.status) {
        throw Error('TX status reverted')
      }

      return true
    }

    const interval = setInterval(async () => {
      if (stepIndex < 4) {
        setStepIndex(stepIndex + 1)
      }

      // safe created using the form
      if (submittedPromise !== undefined) {
        submittedPromise.then(() => {
          setStepIndex(4)
          setWaitingSafeDeployed(true)
          setIntervalStarted(false)
        })
      }

      // safe pending creation recovered from storage
      if (creationTxHash !== undefined) {
        try {
          const res = await isTxMined(creationTxHash)
          if (res) {
            setStepIndex(4)
            setWaitingSafeDeployed(true)
            setIntervalStarted(false)
          }
        } catch (error) {
          onError(error)
        }
      }
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [creationTxHash, submittedPromise, intervalStarted, stepIndex, error, onError])

  useEffect(() => {
    let interval

    const awaitUntilSafeIsDeployed = async (safeCreationTxHash: string) => {
      try {
        const web3 = getWeb3ReadOnly()
        const receipt = await web3.eth.getTransactionReceipt(safeCreationTxHash)

        let safeAddress = ''

        if (receipt?.events) {
          safeAddress = receipt.events.ProxyCreation.returnValues.proxy
        } else {
          // If the node doesn't return the events we try to fetch it from logs
          safeAddress = getNewSafeAddressFromLogs(receipt?.logs || [])
        }

        setCreatedSafeAddress(safeAddress)

        interval = setInterval(async () => {
          let code = EMPTY_DATA
          try {
            code = await web3.eth.getCode(safeAddress)
          } catch (err) {
            console.log(err)
          }
          if (code !== EMPTY_DATA) {
            setStepIndex(5)
            setError(false)
          }
        }, 1000)
      } catch (error) {
        onError(error)
      }
    }

    if (!waitingSafeDeployed) {
      return
    }

    if (typeof safeCreationTxHash === 'string') {
      awaitUntilSafeIsDeployed(safeCreationTxHash)
    }

    return () => {
      clearInterval(interval)
    }
  }, [safeCreationTxHash, waitingSafeDeployed, onError])

  if (loading || stepIndex === undefined) {
    return (
      <LoaderContainer data-testid={'create-safe-loader'}>
        <Loader size="md" />
      </LoaderContainer>
    )
  }

  let FooterComponent
  if (error) {
    FooterComponent = ErrorFooter
  } else if (steps[stepIndex].footerComponent) {
    FooterComponent = steps[stepIndex].footerComponent
  }

  return (
    <Wrapper>
      <Title tag="h2" testId="safe-creation-process-title">
        Safe creation process
      </Title>
      <Nav>
        <Stepper activeStepIndex={stepIndex} error={error} orientation="vertical" steps={steps} />
      </Nav>
      <Body>
        <BodyImage>
          <Img alt="Vault" height={92} src={getImage()} />
        </BodyImage>

        <BodyDescription>
          <CardTitle>{steps[stepIndex].description || steps[stepIndex].label}</CardTitle>
        </BodyDescription>

        {steps[stepIndex].instruction && (
          <BodyInstruction>
            <FullParagraph
              color="primary"
              inversecolors={confirmationStep.toString()}
              noMargin
              size="md"
              $stepIndex={stepIndex}
            >
              {error ? 'You can Cancel or Retry the Safe creation process.' : steps[stepIndex].instruction}
            </FullParagraph>
          </BodyInstruction>
        )}

        {steps[stepIndex].instruction && creationTxHash ? (
          <TxText>
            Your Safe creation transaction:
            <br />
            <Center>
              <PrefixedEthHashInfo hash={creationTxHash} showCopyBtn explorerUrl={getExplorerInfo(creationTxHash)} />
            </Center>
          </TxText>
        ) : null}

        <BodyFooter>
          {FooterComponent ? (
            <FooterComponent
              continueButtonDisabled={continueButtonDisabled}
              onCancel={onCancel}
              onClick={onRetryTx}
              onContinue={navigateToSafe}
              onRetry={onRetryTx}
              safeCreationTxHash={safeCreationTxHash}
            />
          ) : null}
        </BodyFooter>
      </Body>
    </Wrapper>
  )
}

type Props = {
  creationTxHash?: string
  submittedPromise?: Promise<TransactionReceipt>
  onRetry: () => void
  onSuccess: (createdSafeAddress: string) => void
  onCancel: () => void
}

interface FullParagraphProps {
  inversecolors: string
  $stepIndex: number
}

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 250px auto;
  grid-template-rows: 43px auto;
  margin-bottom: 30px;
`

const Title = styled(Heading)`
  grid-column: 1/3;
  grid-row: 1;
  margin: 7px 0 0 0 !important;
`

const Nav = styled.div`
  grid-column: 1;
  grid-row: 2;
`

const Body = styled.div`
  grid-column: 2;
  grid-row: 2;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  min-width: 700px;
  padding-top: 70px;
  box-shadow: 0 0 10px 0 rgba(33, 48, 77, 0.1);

  display: grid;
  grid-template-rows: 100px 50px 110px 1fr;
`

const CardTitle = styled.div`
  font-size: 20px;
  padding-top: 10px;
`

const FullParagraph = styled(Paragraph)<FullParagraphProps>`
  background-color: ${({ $stepIndex }) => ($stepIndex === 0 ? connected : background)};
  color: ${({ theme, $stepIndex }) => ($stepIndex === 0 ? theme.colors.white : fontColor)};
  padding: 28px;
  font-size: 20px;
  margin-bottom: 16px;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
  margin-bottom: -10px;
`

const BodyImage = styled.div`
  grid-row: 1;
`
const BodyDescription = styled.div`
  grid-row: 2;
`
const BodyInstruction = styled.div`
  grid-row: 3;
  margin: 27px 0;
`

const TxText = styled.div`
  grid-row: 4;
  margin: 3em 0;
  font-size: 0.8em;
`

const BodyFooter = styled.div`
  grid-row: 5;

  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`
