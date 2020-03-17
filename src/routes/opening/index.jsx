// @flow
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Stepper } from '~/components-v2'
import LoaderDots from '~/components-v2/feedback/Loader-dots/assets/loader-dots.svg'
import Button from '~/components/layout/Button'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import { getEtherScanLink, getWeb3 } from '~/logic/wallets/getWeb3'
import { background, connected } from '~/theme/variables'

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
  grid-template-rows: 100px 50px 150px 70px auto;
`
const EtherScanLink = styled.a`
  color: ${connected};
`

const CardTitle = styled.div`
  font-size: 20px;
`
const FullParagraph = styled(Paragraph)`
  background-color: ${background};
  padding: 24px;
  font-size: 16px;
  margin-bottom: 16px;
`
const ButtonMargin = styled(Button)`
  margin-right: 16px;
`

const BodyImage = styled.div`
  grid-row: 1;
`
const BodyDesctiption = styled.div`
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

type Props = {
  creationTxHash: Promise<any>,
  submittedPromise: Promise<any>,
  onRetry: () => void,
  onSuccess: () => void,
  onCancel: () => void,
}

const SafeDeployment = ({ creationTxHash, onCancel, onRetry, onSuccess, submittedPromise }: Props) => {
  const [stepIndex, setStepIndex] = useState()
  const [intervalStarted, setIntervalStarted] = useState(false)
  const [error, setError] = useState(false)
  const [safeCreationTxHash, setSafeCreationTxHash] = useState()

  const genericFooter = (
    <span>
      <p>This process should take a couple of minutes.</p>
      <p>
        Follow the progress on{' '}
        <EtherScanLink
          aria-label="Show details on Etherscan"
          href={getEtherScanLink('tx', safeCreationTxHash)}
          rel="noopener noreferrer"
          target="_blank"
        >
          Etherscan.io
        </EtherScanLink>
        .
      </p>
    </span>
  )

  const steps = [
    {
      id: '1',
      label: 'Waiting fot transaction confirmation',
      description: undefined,
      instruction: 'Please confirm the Safe creation in your wallet',
      footer: null,
    },
    {
      id: '2',
      label: 'Transaction submitted',
      description: undefined,
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '3',
      label: 'Validating transaction',
      description: undefined,
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '4',
      label: 'Deploying smart contract',
      description: undefined,
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '5',
      label: 'Generating your Safe',
      description: undefined,
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '6',
      label: 'Success',
      description: 'Your Safe was created successfully',
      instruction: 'Click Below to get started',
      footer: (
        <Button color="primary" onClick={onSuccess} variant="contained">
          Continue
        </Button>
      ),
    },
  ]

  // creating safe from from submission
  useEffect(() => {
    if (submittedPromise === undefined) {
      return
    }

    setStepIndex(0)
    submittedPromise
      .once('transactionHash', txHash => {
        setSafeCreationTxHash(txHash)
        setStepIndex(1)
        setIntervalStarted(true)
      })
      .on('error', setError)
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

    const isTxMined = async txHash => {
      const web3 = getWeb3()
      const txResult = await web3.eth.getTransaction(txHash)
      // blockNumber is null when TX is pending.
      return txResult.blockNumber !== null
    }

    let interval = setInterval(async () => {
      if (stepIndex < 4) {
        setStepIndex(stepIndex + 1)
      }

      if (submittedPromise !== undefined) {
        submittedPromise.then(() => {
          setIntervalStarted(false)
          clearInterval(interval)
          setStepIndex(5)
        })
      }

      if (creationTxHash !== undefined) {
        try {
          const res = await isTxMined(creationTxHash)
          if (res) {
            setIntervalStarted(false)
            clearInterval(interval)
            setStepIndex(5)
          }
        } catch (error) {
          setError(error)
        }
      }
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [creationTxHash, submittedPromise, intervalStarted, stepIndex, setError])

  // discard click event value
  const onRetryTx = () => {
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

  if (stepIndex === undefined) {
    return <div>loading</div>
  }

  return (
    <Wrapper>
      <Title tag="h2">Safe creation process</Title>
      <Nav>
        <Stepper activeStepIndex={stepIndex} error={error} orientation="vertical" steps={steps} />
      </Nav>
      <Body>
        <BodyImage>
          <Img alt="Vault" height={75} src={getImage()} />
        </BodyImage>

        <BodyDesctiption>
          <CardTitle>{steps[stepIndex].description || steps[stepIndex].label}</CardTitle>
        </BodyDesctiption>

        <BodyLoader>{!error && stepIndex <= 4 && <Img alt="LoaderDots" src={LoaderDots} />}</BodyLoader>

        <BodyInstruction>
          <FullParagraph color="primary" noMargin size="md">
            {error ? 'You can Cancel or Retry the Safe creation process.' : steps[stepIndex].instruction}
          </FullParagraph>
        </BodyInstruction>

        <BodyFooter>
          {error ? (
            <>
              <ButtonMargin onClick={onCancel} variant="contained">
                Cancel
              </ButtonMargin>
              <Button color="primary" onClick={onRetryTx} variant="contained">
                Retry
              </Button>
            </>
          ) : (
            steps[stepIndex].footer
          )}
        </BodyFooter>
      </Body>
    </Wrapper>
  )
}

export default SafeDeployment
