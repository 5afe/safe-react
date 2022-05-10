import { Text, theme, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import semverSatisfies from 'semver/functions/satisfies'

import { getModuleData } from './dataFetcher'
import { useStyles } from './style'
import { ModulesTable } from './ModulesTable'

import Block from 'src/components/layout/Block'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { TransactionGuard } from './TransactionGuard'
import FormGroup from '@material-ui/core/FormGroup/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import { toggleBatchExecute } from 'src/logic/appearance/actions/toggleBatchExecute'
import { batchExecuteSelector } from 'src/logic/appearance/selectors'
import { getMultisendContractAddress } from 'src/logic/contracts/safeContracts'

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

const DOCS_LINK = 'https://docs.gnosis-safe.io/contracts/modules-1'

const Advanced = (): ReactElement => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { nonce, modules, guard, currentVersion } = useSelector(currentSafe) ?? {}
  const batchExecute = useSelector(batchExecuteSelector)
  const multiSendContractAddress = getMultisendContractAddress()

  const moduleData = modules ? getModuleData(modules) ?? null : null
  const isVersionWithGuards = semverSatisfies(currentVersion, '>=1.3.0')

  const handleToggleBatchExecute = () => dispatch(toggleBatchExecute())

  return (
    <>
      {/* Nonce */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Nonce
        </Title>
        <InfoText size="lg">
          For security reasons, transactions made with Evmos Safe need to be executed in order. The nonce shows you
          which transaction will be executed next. You can find the nonce for a transaction in the transaction details.
        </InfoText>
        <InfoText color="secondaryLight" size="xl">
          Current Nonce: <Bold data-testid={'current-nonce'}>{nonce}</Bold>
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
          <a href={DOCS_LINK} rel="noopener noreferrer" target="_blank">
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

          {!guard ? <NoTransactionGuardLegend /> : <TransactionGuard address={guard} />}
        </Block>
      )}
      {multiSendContractAddress && (
        <Block className={classes.container}>
          <Title size="xs" withoutMargin>
            Transactions (experimental)
          </Title>
          <FormGroup>
            <InfoText size="lg">
              This feature allows you to batch execute queued transactions. They must be fully signed and strictly
              sequential in safeNonce. Be aware that if any of the included transactions reverts, none of them will be
              executed. This will result in the loss of the allocated transaction fees.
            </InfoText>
            <FormControlLabel
              control={<Checkbox checked={batchExecute} onChange={handleToggleBatchExecute} name="batchExecute" />}
              label="Batch execution"
            />
          </FormGroup>
        </Block>
      )}
    </>
  )
}

export default Advanced
