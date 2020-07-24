import { Text, Title } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

import { styles } from './style'
import Beneficiary from './assets/beneficiary.svg'
import AssetAmount from './assets/asset-amount.svg'
import Time from './assets/time.svg'

import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import Button from 'src/components/layout/Button'

const useStyles = makeStyles(styles)

const InfoText = styled(Text)`
  margin-top: 16px;
`

const Steps = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  max-width: 720px;
  text-align: center;
`

const StepsLine = styled.div`
  height: 2px;
  flex: 1;
  background: #d4d5d3;
  margin: 46px 0;
`

const SpendingLimitStep = styled.div`
  width: 24%;
  min-width: 120px;
  max-width: 164px;
`

const SpendingLimit = (): React.ReactElement => {
  const classes = useStyles()

  return (
    <>
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Spending Limit
        </Title>
        <InfoText size="lg">
          You can set rules for specific beneficiaries to access funds from this Safe without having to collect all
          signatures.
        </InfoText>
        <Steps>
          <SpendingLimitStep>
            <Img alt="Select Beneficiary" title="Beneficiary" height={96} src={Beneficiary} />
            <Text size="lg" color="placeHolder" strong center>
              Select Beneficiary
            </Text>
            <Text size="lg" color="placeHolder" center>
              Choose an account that will benefit from this allowance.
            </Text>
            <Text size="lg" color="placeHolder" center>
              The beneficiary does not have to be an owner of this Safe
            </Text>
          </SpendingLimitStep>
          <StepsLine />
          <SpendingLimitStep>
            <Img alt="Select asset and amount" title="Asset and Amount" height={96} src={AssetAmount} />
            <Text size="lg" color="placeHolder" strong center>
              Select asset and amount
            </Text>
            <Text size="lg" color="placeHolder" center>
              You can set a spending limit for any asset stored in your Safe
            </Text>
          </SpendingLimitStep>
          <StepsLine />
          <SpendingLimitStep>
            <Img alt="Select time" title="Time" height={96} src={Time} />
            <Text size="lg" color="placeHolder" strong center>
              Select time
            </Text>
            <Text size="lg" color="placeHolder" center>
              You can choose to set a one-time spending limit or to have it automatically refill after a defined
              time-period
            </Text>
          </SpendingLimitStep>
        </Steps>
      </Block>
      <Row align="end" className={classes.buttonRow} grow>
        <Col end="xs">
          <Button
            className={classes.actionButton}
            color="primary"
            size="small"
            testId="new-spending-limit-button"
            onClick={() => {}}
            variant="contained"
            disabled
          >
            New spending limit
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default SpendingLimit
