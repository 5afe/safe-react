import { Loader, Text, theme, Title } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getModuleData } from './dataFetcher'
import { styles } from './style'
import ModulesTable from './ModulesTable'

import Block from 'src/components/layout/Block'
import { safeModulesSelector, safeNonceSelector } from 'src/logic/safe/store/selectors'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

const useStyles = makeStyles(styles)

const InfoText = styled(Text)`
  margin-top: 16px;
`

const Bold = styled.strong`
  color: ${theme.colors.text};
`

const NoModuleLegend = (): React.ReactElement => (
  <InfoText color="secondaryLight" size="xl">
    No modules enabled
  </InfoText>
)

const LoadingModules = (): React.ReactElement => {
  const classes = useStyles()

  return (
    <Block className={classes.container}>
      <Loader size="md" />
    </Block>
  )
}

const Advanced = (): React.ReactElement => {
  const classes = useStyles()
  const nonce = useSelector(safeNonceSelector)
  const modules = useSelector(safeModulesSelector)
  const moduleData = modules ? getModuleData(modules) ?? null : null
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
          For security reasons, transactions made with the Safe need to be executed in order. The nonce shows you which
          transaction was executed most recently. You can find the nonce for a transaction in the transaction details.
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

        {!moduleData ? (
          <NoModuleLegend />
        ) : moduleData?.length === 0 ? (
          <LoadingModules />
        ) : (
          <ModulesTable moduleData={moduleData} />
        )}
      </Block>
    </>
  )
}

export default Advanced
