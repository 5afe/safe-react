import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { Title, Text, Divider, Link, Icon } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Row from 'src/components/layout/Row'
import { styles } from './style'
import GnoForm from 'src/components/forms/GnoForm'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { composeValidators, minValue } from 'src/components/forms/validator'

import { ParametersStatus, areSafeParamsEnabled, areEthereumParamsEnabled } from '../utils'
import { getNetworkInfo } from 'src/config'

const StyledDivider = styled(Divider)`
  margin: 0px;
`

const SafeOptions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`

const EthereumOptions = styled.div`
  display: flex;
  /* justify-content: space-between; */
  flex-wrap: wrap;
  gap: 10px 20px;

  div {
    width: 216px !important;
  }
`
const StyledLink = styled(Link)`
  margin: 16px 0;
  display: inline-flex;
  align-items: center;

  > :first-of-type {
    margin-right: 5px;
  }
`
const StyledIconButton = styled(IconButton)`
  margin: 10px 0 0 0;
`
const StyledText = styled(Text)`
  margin: 0 0 4px 0;
`
const StyledTextMt = styled(Text)`
  margin: 16px 0 4px 0;
`

const useStyles = makeStyles(styles)

const { label } = getNetworkInfo()

interface Props {
  txParameters: TxParameters
  onClose: (txParameters?: TxParameters) => void
  parametersStatus: ParametersStatus
}

const formValidation = (values) => {
  const { ethGasLimit, ethGasPrice, ethNonce, safeNonce, safeTxGas } = values ?? {}

  const ethGasLimitValidation = minValue(0, true)(ethGasLimit)

  const ethGasPriceValidation = minValue(0, true)(ethGasPrice)

  const ethNonceValidation = minValue(0, true)(ethNonce)

  const safeNonceValidation = minValue(0, true)(safeNonce)

  const safeTxGasValidation = composeValidators(minValue(0, true), (value: string) => {
    if (!value) {
      return
    }

    if (Number(value) > Number(ethGasLimit)) {
      return `Bigger than ${label} gas limit.`
    }
  })(safeTxGas)

  return {
    ethGasLimit: ethGasLimitValidation,
    ethGasPrice: ethGasPriceValidation,
    ethNonce: ethNonceValidation,
    safeNonce: safeNonceValidation,
    safeTxGas: safeTxGasValidation,
  }
}

export const EditTxParametersForm = ({
  onClose,
  txParameters,
  parametersStatus = 'ENABLED',
}: Props): React.ReactElement => {
  const classes = useStyles()
  const { safeNonce, safeTxGas, ethNonce, ethGasLimit, ethGasPrice } = txParameters

  const onSubmit = (values: TxParameters) => {
    onClose(values)
  }

  const onCloseFormHandler = () => {
    onClose()
  }

  return (
    <>
      {/* Header */}
      <Row align="center" className={classes.heading} grow data-testid="send-funds-review-step">
        <Title size="sm" withoutMargin>
          Advanced options
        </Title>
        <StyledIconButton disableRipple onClick={onCloseFormHandler}>
          <Close className={classes.closeIcon} />
        </StyledIconButton>
      </Row>

      <StyledDivider />

      <Block className={classes.container}>
        <GnoForm
          initialValues={{
            safeNonce: safeNonce || 0,
            safeTxGas: safeTxGas || '',
            ethNonce: ethNonce || '',
            ethGasLimit: ethGasLimit || '',
            ethGasPrice: ethGasPrice || '',
          }}
          onSubmit={onSubmit}
          validation={formValidation}
        >
          {() => (
            <>
              <StyledText size="xl" strong>
                Safe transactions parameters
              </StyledText>

              <SafeOptions>
                <Field
                  name="safeNonce"
                  defaultValue={safeNonce}
                  placeholder="Safe nonce"
                  text="Safe nonce"
                  type="number"
                  min="0"
                  component={TextField}
                  disabled={!areSafeParamsEnabled(parametersStatus)}
                />
                <Field
                  name="safeTxGas"
                  defaultValue={safeTxGas}
                  placeholder="SafeTxGas"
                  text="SafeTxGas"
                  type="number"
                  min="0"
                  component={TextField}
                  disabled={!areSafeParamsEnabled(parametersStatus)}
                />
              </SafeOptions>

              <StyledTextMt size="xl" strong>
                Ethereum transactions parameters
              </StyledTextMt>

              <EthereumOptions>
                <Field
                  name="ethNonce"
                  defaultValue={ethNonce}
                  placeholder="Ethereum nonce"
                  text="Ethereum nonce"
                  type="number"
                  component={TextField}
                  disabled={!areEthereumParamsEnabled(parametersStatus)}
                />
                <Field
                  name="ethGasLimit"
                  defaultValue={ethGasLimit}
                  placeholder="Ethereum gas limit"
                  text="Ethereum gas limit"
                  type="number"
                  component={TextField}
                  disabled={parametersStatus === 'CANCEL_TRANSACTION'}
                />
                <Field
                  name="ethGasPrice"
                  defaultValue={ethGasPrice}
                  type="number"
                  placeholder="Ethereum gas price (GWEI)"
                  text="Ethereum gas price (GWEI)"
                  component={TextField}
                  disabled={!areEthereumParamsEnabled(parametersStatus)}
                />
              </EthereumOptions>

              <StyledLink
                href="https://help.gnosis-safe.io/en/articles/4738445-configure-advanced-transaction-parameters-manually"
                target="_blank"
              >
                <Text size="xl" color="primary">
                  How can I configure the gas price manually?
                </Text>
                <Icon size="sm" type="externalLink" color="primary" />
              </StyledLink>

              <StyledDivider />

              {/* Footer */}
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onCloseFormHandler}>
                  Back
                </Button>
                <Button
                  className={classes.submitButton}
                  color="primary"
                  data-testid="submit-tx-btn"
                  /* disabled={!data} */
                  minWidth={140}
                  /* onClick={submitTx} */
                  type="submit"
                  variant="contained"
                >
                  Confirm
                </Button>
              </Row>
            </>
          )}
        </GnoForm>
      </Block>
    </>
  )
}
