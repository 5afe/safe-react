// @flow
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Stepper } from '~/components-v2'
import Loader from '~/components/Loader'
import Button from '~/components/layout/Button'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import Page from '~/components/layout/Page'
import Paragraph from '~/components/layout/Paragraph'
import { getWeb3 } from '~/logic/wallets/getWeb3'

const vault = require('./assets/vault.svg')

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 250px auto;
  grid-template-rows: 62px auto;
  height: 600px;
  margin-bottom: 30px;
`

const Title = styled(Heading)`
  grid-column: 1/3;
  grid-row: 1;
`

export const Nav = styled.div`
  grid-column: 1;
  grid-row: 2;
`

export const Body = styled.div`
  grid-column: 2;
  grid-row: 2;
  text-align: center;
  background-color: #ffffff;
  border-radius: 5px;
  min-width: 770px;
  padding: 30px 0;
  margin-bottom: 38px;
  box-shadow: 0 0 10px 0 rgba(33, 48, 77, 0.1);
`
const CardTitle = styled.div`
  font-size: 20px;
  margin: 16px;
`
const FullParagraph = styled(Paragraph)`
  background-color: #f5f5f5;
  padding: 24px;
  font-size: 16px;
`

const genericFooter = (
  <span>
    <p>This process should take a couple of minutes.</p>
    <p>Follow the progress on Etherscan.io.</p>
  </span>
)

type Props = {
  creationTxHash: Promise<any>,
  submittedPromise: Promise<any>,
  onRetry: () => void,
  onSuccess: () => void,
  onCancel: () => void,
}

const SafeDeployment = ({ creationTxHash, onCancel, onRetry, onSuccess, submittedPromise }: Props) => {
  const steps = [
    {
      id: '1',
      label: 'Waiting fot transaction confirmation',
      instruction: 'Please confirm the Safe creation in your wallet',
      footer: null,
    },
    {
      id: '2',
      label: 'Transaction submitted',
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '3',
      label: 'Validating transaction',
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '4',
      label: 'Deploying smart contract',
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '5',
      label: 'Generating your Safe',
      instruction: 'Please do not leave the page',
      footer: genericFooter,
    },
    {
      id: '6',
      label: 'Success',
      instruction: 'Click Below to get started',
      footer: (
        <Button color="primary" onClick={onSuccess} variant="contained">
          Continue
        </Button>
      ),
    },
  ]

  const [stepIndex, setStepIndex] = useState()
  const [intervalStarted, setIntervalStarted] = useState(false)
  const [error, setError] = useState()

  // creating safe from from submission
  useEffect(() => {
    if (submittedPromise === undefined) {
      return
    }

    setStepIndex(0)
    submittedPromise
      .once('transactionHash', () => {
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

      if (submittedPromise !== undefined) {
        submittedPromise.then(() => {
          setIntervalStarted(false)
          clearInterval(interval)
          setStepIndex(5)
        })
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

  if (stepIndex === undefined) {
    return <div>loading</div>
  }

  return (
    <Page align="center">
      <Wrapper>
        <Title tag="h2">Safe creation proccess</Title>
        <Nav>
          <Stepper activeStepIndex={stepIndex} error={error} orientation="vertical" steps={steps} />
        </Nav>
        <Body>
          <Img alt="Vault" height={75} src={vault} />

          <CardTitle>{steps[stepIndex].label}</CardTitle>

          {!error && stepIndex <= 4 && <Loader />}

          <FullParagraph color="primary" noMargin size="md">
            {steps[stepIndex].instruction}
          </FullParagraph>

          {steps[stepIndex].footer}

          {error && (
            <>
              <Button onClick={onCancel}>cancel</Button>
              <Button color="primary" onClick={onRetryTx}>
                Retry
              </Button>
            </>
          )}
        </Body>
      </Wrapper>
    </Page>
  )
}

export default SafeDeployment
