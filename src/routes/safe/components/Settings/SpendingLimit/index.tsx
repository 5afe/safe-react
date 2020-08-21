import { Button, Text, Title } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { extendedSafeTokensSelector, grantedSelector } from 'src/routes/safe/container/selector'

import { getSpendingLimitData, SpendingLimitTable } from './dataFetcher'
import LimitsTable from './LimitsTable'
import NewLimitModal from './NewLimitModal'
import NewLimitSteps from './NewLimitSteps'
import { useStyles } from './style'
import { requestAllowancesByDelegatesAndTokens, requestModuleData, requestTokensByDelegate } from './utils'

const InfoText = styled(Text)`
  margin-top: 16px;
`

const SpendingLimitSettings = (): React.ReactElement => {
  const classes = useStyles()
  const granted = useSelector(grantedSelector)
  const tokens = useSelector(extendedSafeTokensSelector)

  // TODO: Refactor `delegates` for better performance. This is just to verify allowance works
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [spendingLimitData, setSpendingLimitData] = React.useState<SpendingLimitTable[]>()
  React.useEffect(() => {
    const doRequestData = async () => {
      const [, delegates] = await requestModuleData(safeAddress)
      const tokensByDelegate = await requestTokensByDelegate(safeAddress, delegates.results)
      const allowances = await requestAllowancesByDelegatesAndTokens(safeAddress, tokensByDelegate)
      setSpendingLimitData(getSpendingLimitData(allowances))
    }
    doRequestData()
  }, [safeAddress, tokens])

  const [showNewSpendingLimitModal, setShowNewSpendingLimitModal] = React.useState(false)
  const openNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(true)
  }
  const closeNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(false)
  }

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
        {spendingLimitData?.length ? <LimitsTable data={spendingLimitData} /> : <NewLimitSteps />}
      </Block>

      {granted && (
        <>
          <Row align="end" className={classes.buttonRow} grow>
            <Col end="xs">
              <Button
                className={classes.actionButton}
                color="primary"
                size="md"
                data-testid="new-spending-limit-button"
                onClick={openNewSpendingLimitModal}
                variant="contained"
              >
                New spending limit
              </Button>
            </Col>
          </Row>
          {showNewSpendingLimitModal && <NewLimitModal close={closeNewSpendingLimitModal} open={true} />}
        </>
      )}
    </>
  )
}

export default SpendingLimitSettings
