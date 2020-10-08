import { Loader, Stepper } from '@gnosis.pm/safe-react-components'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ErrorFooter } from 'src/routes/opening/components/Footer'
import { isConfirmationStep, steps } from './steps'

import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { initContracts } from 'src/logic/contracts/safeContracts'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { background, connected } from 'src/theme/variables'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'

const loaderDotsSvg = require('./assets/loader-dots.svg')
const successSvg = require('./assets/success.svg')
const vaultErrorSvg = require('./assets/vault-error.svg')
const vaultSvg = require('./assets/vault.svg')

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 250px auto;
  grid-template-rows: 62px auto;
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
  background-color: #ffffff;
  border-radius: 5px;
  min-width: 700px;
  padding-top: 50px;
  box-shadow: 0 0 10px 0 rgba(33, 48, 77, 0.1);

  display: grid;
  grid-template-rows: 100px 50px 70px 60px 100px;
`

const CardTitle = styled.div`
  font-size: 20px;
`
const FullParagraph = styled(Paragraph)`
  background-color: ${(p) => (p.inverseColors ? connected : background)};
  color: ${(p) => (p.inverseColors ? background : connected)};
  padding: 24px;
  font-size: 16px;
  margin-bottom: 16px;

  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
`

const BodyImage = styled.div`
  grid-row: 1;
`
const BodyDescription = styled.div`
  grid-row: 2;
`
const BodyLoader = styled.div`
  grid-row: 3;
  display: flex;
  justify-content: center;
  align-items: center;
`
const BodyInstruction = styled.div`
  grid-row: 4;
`
const BodyFooter = styled.div`
  grid-row: 5;

  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const BackButton = styled(Button)`
  grid-column: 2;
  margin: 20px auto 0;
`

// type Props = {
//   provider: string
//   creationTxHash: Promise<any>
//   submittedPromise: Promise<any>
//   onRetry: () => void
//   onSuccess: () => void
//   onCancel: () => void
// }

const SafeDeployment = ({ creationTxHash, onCancel, onRetry, onSuccess, submittedPromise }): React.ReactElement => {
  const [loading, setLoading] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [safeCreationTxHash, setSafeCreationTxHash] = useState('')
  const [createdSafeAddress, setCreatedSafeAddress] = useState('')

  const [error, setError] = useState(false)
  const [intervalStarted, setIntervalStarted] = useState(false)
  const [waitingSafeDeployed, setWaitingSafeDeployed] = useState(false)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false)
  const provider = useSelector(providerNameSelector)

  const confirmationStep = isConfirmationStep(stepIndex)

  const navigateToSafe = () => {
    setContinueButtonDisabled(true)
    onSuccess(createdSafeAddress)
  }

  const onError = (error) => {
    setIntervalStarted(false)
    setWaitingSafeDeployed(false)
    setContinueButtonDisabled(false)
    setError(true)
    console.error(error)
  }

  // discard click event value
  const onRetryTx = () => {
    setStepIndex(0)
    setError(false)
    onRetry()
  }

  const getImage = () => {
    if (error) {
      return vaultErrorSvg
    }

    if (stepIndex <= 4) {
      return vaultSvg
    }

    return successSvg
  }

  useEffect(() => {
    const loadContracts = async () => {
      await initContracts()
      setLoading(false)
    }

    if (provider) {
      loadContracts()
    }
  }, [provider])

  // creating safe from from submission
  useEffect(() => {
    if (submittedPromise === undefined) {
      return
    }

    setStepIndex(0)
    submittedPromise
      .once('transactionHash', (txHash) => {
        setSafeCreationTxHash(txHash)
        setStepIndex(1)
        setIntervalStarted(true)
      })
      .on('error', onError)
  }, [submittedPromise])

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

    const isTxMined = async (txHash) => {
      const web3 = getWeb3()

      const txResult = await web3.eth.getTransaction(txHash)
      if (txResult.blockNumber === null) {
        return false
      }

      const receipt = await web3.eth.getTransactionReceipt(txHash)
      if (!receipt.status) {
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
  }, [creationTxHash, submittedPromise, intervalStarted, stepIndex, error])

  useEffect(() => {
    let interval

    const awaitUntilSafeIsDeployed = async (safeCreationTxHash: string) => {
      try {
        const web3 = getWeb3()
        const receipt = await web3.eth.getTransactionReceipt(safeCreationTxHash)

        let safeAddress

        if (receipt.events) {
          safeAddress = receipt.events.ProxyCreation.returnValues.proxy
        } else {
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
          safeAddress = events[0]
        }

        setCreatedSafeAddress(safeAddress)

        interval = setInterval(async () => {
          const code = await web3.eth.getCode(safeAddress)
          if (code !== EMPTY_DATA) {
            setStepIndex(5)
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
  }, [safeCreationTxHash, waitingSafeDeployed])

  if (loading || stepIndex === undefined) {
    return <Loader size="sm" />
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
          <Img alt="Vault" height={75} src={getImage()} />
        </BodyImage>

        <BodyDescription>
          <CardTitle>{steps[stepIndex].description || steps[stepIndex].label}</CardTitle>
        </BodyDescription>

        <BodyLoader>{!error && stepIndex <= 4 && <Img alt="Loader dots" src={loaderDotsSvg} />}</BodyLoader>

        <BodyInstruction>
          <FullParagraph color="primary" inverseColors={confirmationStep} noMargin size="md">
            {error ? 'You can Cancel or Retry the Safe creation process.' : steps[stepIndex].instruction}
          </FullParagraph>
        </BodyInstruction>

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
      <BackButton color="primary" minWidth={140} onClick={onCancel} data-testid="safe-creation-back-btn">
        Back
      </BackButton>
    </Wrapper>
  )
}

export default SafeDeployment
