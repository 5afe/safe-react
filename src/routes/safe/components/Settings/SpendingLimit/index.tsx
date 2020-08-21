import { Button, Text, Title } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import SpendingLimitModal from './SpendingLimitModal'
import SpendingLimitSteps from './SpendingLimitSteps'
import { requestModuleData } from './utils'
import { grantedSelector } from 'src/routes/safe/container/selector'
import styled from 'styled-components'

import { useStyles } from './style'

const InfoText = styled(Text)`
  margin-top: 16px;
`

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
`

export const StyledButton = styled.button`
  background: none;
  border: none;
  padding: 5px;
  width: 26px;
  height: 26px;

  span {
    margin-right: 0;
  }

  :hover {
    background: ${({ theme }) => theme.colors.separator};
    border-radius: 16px;
    cursor: pointer;
  }
`

export const FooterSection = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.separator};
  padding: 16px 24px;
`

export const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

const SpendingLimitSettings = (): React.ReactElement => {
  const classes = useStyles()
  const granted = useSelector(grantedSelector)
  const [showNewSpendingLimitModal, setShowNewSpendingLimitModal] = React.useState(false)

  // TODO: Refactor `delegates` for better performance. This is just to verify allowance works
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [delegates, setDelegates] = React.useState({ results: [], next: '' })
  React.useEffect(() => {
    const doRequestData = async () => {
      const [, delegates] = await requestModuleData(safeAddress)
      setDelegates(delegates)
    }
    doRequestData()
  }, [safeAddress])

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
        {delegates?.results?.length ? (
          delegates.results.map((delegate) => <div key={delegate}>{delegate}</div>)
        ) : (
          <SpendingLimitSteps />
        )}
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
          {showNewSpendingLimitModal && <SpendingLimitModal close={closeNewSpendingLimitModal} open={true} />}
        </>
      )}
    </>
  )
}

export default SpendingLimitSettings
