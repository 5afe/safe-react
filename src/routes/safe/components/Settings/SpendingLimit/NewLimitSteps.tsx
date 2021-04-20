import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import AssetAmount from './assets/asset-amount.svg'
import Beneficiary from './assets/beneficiary.svg'
import Time from './assets/time.svg'

const StepWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  max-width: 720px;
  text-align: center;
`

const Step = styled.div`
  width: 24%;
  min-width: 120px;
  max-width: 164px;
`

const StepsLine = styled.div`
  height: 2px;
  flex: 1;
  background: #d4d5d3;
  margin: 46px 0;
`

export const NewLimitSteps = (): ReactElement => (
  <StepWrapper>
    <Step>
      <Img alt="Select Beneficiary" title="Beneficiary" height={96} src={Beneficiary} />

      <Text size="lg" color="placeHolder" strong center>
        Select Beneficiary
      </Text>

      <Text size="lg" color="placeHolder" center>
        Define beneficiary that will be able to use the allowance.
      </Text>

      <Text size="lg" color="placeHolder" center>
        The beneficiary does not have to be an owner of this Safe
      </Text>
    </Step>

    <StepsLine />

    <Step>
      <Img alt="Select asset and amount" title="Asset and Amount" height={96} src={AssetAmount} />

      <Text size="lg" color="placeHolder" strong center>
        Select asset and amount
      </Text>

      <Text size="lg" color="placeHolder" center>
        You can set a spending limit for any asset stored in your Safe
      </Text>
    </Step>

    <StepsLine />

    <Step>
      <Img alt="Select time" title="Time" height={96} src={Time} />

      <Text size="lg" color="placeHolder" strong center>
        Select time
      </Text>

      <Text size="lg" color="placeHolder" center>
        You can choose to set a one-time spending limit or to have it automatically refill after a defined time-period
      </Text>
    </Step>
  </StepWrapper>
)
