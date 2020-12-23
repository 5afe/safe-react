import { Menu } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { historyTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Breadcrumb = styled.div`
  height: 51px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
`

const GatewayTransactions = (): ReactElement => {
  const historyTxs = useSelector(historyTransactions)

  return (
    <Wrapper>
      <Menu>
        <Breadcrumb />
      </Menu>
      <ContentWrapper>
        {historyTxs &&
          Object.entries(historyTxs).map(([timestamp, transactions]) => (
            <React.Fragment key={timestamp}>
              <div>{timestamp}</div>
              {transactions.map((transaction) => (
                <div key={transaction.id}>{JSON.stringify(transaction)}</div>
              ))}
            </React.Fragment>
          ))}
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
