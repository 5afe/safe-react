import { Menu, Breadcrumb, BreadcrumbElement } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { Redirect, Route, Switch, useRouteMatch, Link } from 'react-router-dom'
import styled from 'styled-components'

import Col from 'src/components/layout/Col'
import { extractPrefixedSafeAddress, generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { HistoryTransactions } from './HistoryTransactions'
import { QueueTransactions } from './QueueTransactions'
import { ContentWrapper, Wrapper } from './styled'
import TxSingularDetails from './TxSingularDetails'
import { isDeeplinkedTx } from './utils'

const StyledLink = styled(Link)`
  text-decoration: none;
  & * {
    cursor: pointer !important;
  }
`

const GatewayTransactions = (): ReactElement => {
  const { path } = useRouteMatch()
  const isTxDetails = isDeeplinkedTx()

  let breadcrumbText = 'History'
  if (isTxDetails) {
    breadcrumbText = 'Details'
  } else if (path === SAFE_ROUTES.TRANSACTIONS_QUEUE) {
    breadcrumbText = 'Queue'
  }

  return (
    <Wrapper>
      <Menu>
        <Col start="sm" xs={12}>
          <Breadcrumb>
            {((parentCrumb) =>
              !isTxDetails ? (
                parentCrumb
              ) : (
                <StyledLink to={generateSafeRoute(SAFE_ROUTES.TRANSACTIONS, extractPrefixedSafeAddress())}>
                  {parentCrumb}
                </StyledLink>
              ))(<BreadcrumbElement iconType="transactionsInactive" text="TRANSACTIONS" color="primary" />)}

            <BreadcrumbElement text={breadcrumbText.toUpperCase()} color="cantoGreen" />
          </Breadcrumb>
        </Col>
      </Menu>

      <ContentWrapper>
        <Switch>
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_QUEUE} render={() => <QueueTransactions />} />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_HISTORY} render={() => <HistoryTransactions />} />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_SINGULAR} render={() => <TxSingularDetails />} />
          <Redirect to={SAFE_ROUTES.TRANSACTIONS_HISTORY} />
        </Switch>
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
