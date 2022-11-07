import { Text, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import semverSatisfies from 'semver/functions/satisfies'

import { getModuleData } from './dataFetcher'
import { useStyles } from './style'
import { ModulesTable } from './ModulesTable'

import Block from 'src/components/layout/Block'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { TransactionGuard } from './TransactionGuard'

const InfoText = styled(Text)`
  margin-top: 16px;
`

const Bold = styled.strong`
  color: #69fc99;
`

const NoModuleLegend = (): ReactElement => (
  <InfoText color="primary" size="xl">
    No modules enabled
  </InfoText>
)

const NoTransactionGuardLegend = (): ReactElement => (
  <InfoText color="primary" size="xl">
    No transaction guard set
  </InfoText>
)

const DOCS_LINK = 'https://docs.gnosis-safe.io/contracts/modules-1'

const Advanced = (): ReactElement => {
  const classes = useStyles()
  const { nonce, modules, guard, currentVersion } = useSelector(currentSafe) ?? {}

  const moduleData = modules ? getModuleData(modules) ?? null : null
  const isVersionWithGuards = semverSatisfies(currentVersion, '>=1.3.0')

  return (
    <>
      {/* Nonce */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Nonce
        </Title>
        <InfoText color="primary" size="lg">
          For security reasons, transactions made with Safe need to be executed in order. The nonce shows you which
          transaction will be executed next. You can find the nonce for a transaction in the transaction details.
        </InfoText>
        <InfoText color="primary" size="xl">
          Current Nonce: <Bold data-testid={'current-nonce'}>{nonce}</Bold>
        </InfoText>
      </Block>

      {/* Modules */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Modules
        </Title>
        <InfoText color="primary" size="lg">
          Modules allow you to customize the access-control logic of your Safe. Modules are potentially risky, so make
          sure to only use modules from trusted sources. Learn more about modules{' '}
          <a href={DOCS_LINK} style={{ color: '#69fc99' }} rel="noopener noreferrer" target="_blank">
            here
          </a>
          .
        </InfoText>

        {!moduleData || !moduleData.length ? <NoModuleLegend /> : <ModulesTable moduleData={moduleData} />}
      </Block>

      {/* Transaction guard */}
      {isVersionWithGuards && (
        <Block className={classes.container}>
          <Title size="xs" withoutMargin>
            Transaction Guard
          </Title>
          <InfoText color="primary" size="lg">
            Transaction guards impose additional constraints that are checked prior to executing a Safe transaction.
            Transaction guards are potentially risky, so make sure to only use modules from trusted sources. Learn more
            about transaction guards{' '}
            <a
              href="https://help.gnosis-safe.io/en/articles/5324092-what-is-a-transaction-guard"
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: '#69ff99' }}
            >
              here
            </a>
            .
          </InfoText>

          {!guard ? <NoTransactionGuardLegend /> : <TransactionGuard address={guard} />}
        </Block>
      )}
    </>
  )
}

export default Advanced
