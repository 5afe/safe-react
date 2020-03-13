// @flow
import React, { useState } from 'react'
import styled from 'styled-components'

import { Stepper } from '~/components-v2'
import Loader from '~/components/Loader'
import Button from '~/components/layout/Button'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import Page from '~/components/layout/Page'
import Paragraph from '~/components/layout/Paragraph'

const vault = require('../assets/vault.svg')

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

const steps = [
  {
    id: '1',
    label: 'Waiting fot transaction confirmation',
    instruction: 'Please confirm the Safe creation in your wallet',
    duration: -1,
    footer: <div></div>,
  },
  {
    id: '2',
    label: 'Transaction submitted',
    instruction: 'Please do not leave the page',
    duration: 5000,
    footer: genericFooter,
  },
  {
    id: '3',
    label: 'Validating transaction',
    instruction: 'Please do not leave the page',
    duration: 5000,
    footer: genericFooter,
  },
  {
    id: '4',
    label: 'Deploying smart contract',
    instruction: 'Please do not leave the page',
    duration: 5000,
    footer: genericFooter,
  },
  {
    id: '5',
    label: 'Generating your Safe',
    instruction: 'Please do not leave the page',
    duration: 5000,
    footer: genericFooter,
  },
  {
    id: '6',
    label: 'Success',
    instruction: 'Click Below to get started',
    duration: 5000,
    footer: (
      <Button color="primary" variant="contained">
        Continue
      </Button>
    ),
  },
]

const SafeDeployment = () => {
  const [stepIndex] = useState(0)

  return (
    <Page align="center">
      <Wrapper>
        <Title tag="h2">Safe creation proccess</Title>
        <Nav>
          <Stepper activeStepIndex={stepIndex} orientation="vertical" steps={steps} />
        </Nav>
        <Body>
          <Img alt="Vault" height={75} src={vault} />

          <CardTitle>{steps[stepIndex].label}</CardTitle>

          <Loader />

          <FullParagraph color="primary" noMargin size="md">
            {steps[stepIndex].instruction}
          </FullParagraph>
        </Body>
      </Wrapper>
    </Page>
  )
}

export default SafeDeployment
