import { Text, theme, Title } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getModuleData } from './dataFetcher'
import { useStyles } from './style'
import { ModulesTable } from './ModulesTable'

import Block from 'src/components/layout/Block'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { ModulePair } from 'src/logic/safe/store/models/safe'

const InfoText = styled(Text)`
  margin-top: 16px;
`

const Bold = styled.strong`
  color: ${theme.colors.text};
`

const NoModuleLegend = (): ReactElement => (
  <InfoText color="secondaryLight" size="xl">
    No modules enabled
  </InfoText>
)

const NoTransactionGuardLegend = (): ReactElement => (
  <InfoText color="secondaryLight" size="xl">
    No transaction guard set
  </InfoText>
)

const Advanced = (): ReactElement => {
  const classes = useStyles()
  const { nonce, modules } = useSelector(currentSafe) ?? {}
  const moduleData = modules ? getModuleData(modules) ?? null : null
  const transactionGuard: ModulePair[] = [
    ['0xc9479981BC50b7389A71E8783306c2Cb913159E9', '0xc9479981BC50b7389A71E8783306c2Cb913159E9'],
  ]
  const transactionGuardData = getModuleData(transactionGuard) ?? null
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Settings', label: 'Advanced' })
  }, [trackEvent])

  return (
    <>
      {/* Nonce */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Nonce
        </Title>
        <InfoText size="lg">
          For security reasons, transactions made with Gnosis Safe need to be executed in order. The nonce shows you
          which transaction will be executed next. You can find the nonce for a transaction in the transaction details.
        </InfoText>
        <InfoText color="secondaryLight" size="xl">
          Current Nonce: <Bold>{nonce}</Bold>
        </InfoText>
      </Block>

      {/* Modules */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Modules
        </Title>
        <InfoText size="lg">
          Modules allow you to customize the access-control logic of your Safe. Modules are potentially risky, so make
          sure to only use modules from trusted sources. Learn more about modules{' '}
          <a
            href="https://docs.gnosis.io/safe/docs/contracts_architecture/#3-module-management"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </InfoText>

        {!moduleData || !moduleData.length ? <NoModuleLegend /> : <ModulesTable moduleData={moduleData} />}
      </Block>

      {/* Transaction guard */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Transaction guard
        </Title>
        <InfoText size="lg">
          Transaction guards impose additional constraints that are checked prior to executing a Safe transaction.
          Transaction guards are potentially risky, so make sure to only use modules from trusted sources. Learn more
          about transaction guards{' '}
          <a
            href="https://help.gnosis-safe.io/en/articles/5324092-what-is-a-transaction-guard"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </InfoText>

        {!transactionGuardData || !transactionGuardData.length ? (
          <NoTransactionGuardLegend />
        ) : (
          <ModulesTable moduleData={transactionGuardData} />
        )}
      </Block>
    </>
  )
}

export default Advanced
