import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { Title, Text, Divider, Link, Icon } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import { styles } from './style'
import GnoForm from 'src/components/forms/GnoForm'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { minValue } from 'src/components/forms/validator'
import { Modal } from 'src/components/Modal'

import { ParametersStatus, areSafeParamsEnabled, areEthereumParamsVisible, ethereumTxParametersTitle } from '../utils'

const StyledDivider = styled(Divider)`
  margin: 0px;
`
const StyledDividerFooter = styled(Divider)`
  margin: 16px -24px;
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
  margin: 16px 0 0 0;
  display: inline-flex;
  align-items: center;

  > :first-of-type {
    margin-right: 5px;
  }
`
const StyledText = styled(Text)`
  margin: 0 0 4px 0;
`
const StyledTextMt = styled(Text)`
  margin: 16px 0 4px 0;
`
const useStyles = makeStyles(styles)

interface Props {
  txParameters: TxParameters
  onClose: (txParameters?: TxParameters) => void
  parametersStatus: ParametersStatus
  isExecution: boolean
}

const formValidation = (values) => {
  const { ethGasLimit, ethGasPrice, ethNonce, safeNonce, safeTxGas } = values ?? {}

  const ethGasLimitValidation = minValue(0, true)(ethGasLimit)

  const ethGasPriceValidation = minValue(0, true)(ethGasPrice)

  const ethNonceValidation = minValue(0, true)(ethNonce)

  const safeNonceValidation = minValue(0, true)(safeNonce)

  const safeTxGasValidation = minValue(0, true)(safeTxGas)

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
  isExecution,
}: Props): ReactElement => {
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
        <IconButton disableRipple onClick={onCloseFormHandler}>
          <Close className={classes.closeIcon} />
        </IconButton>
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
                Safe transaction
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

              {areEthereumParamsVisible(parametersStatus) && (
                <>
                  <StyledTextMt size="xl" strong>
                    {ethereumTxParametersTitle(isExecution)}
                  </StyledTextMt>

                  <EthereumOptions>
                    <Field
                      name="ethNonce"
                      defaultValue={ethNonce}
                      placeholder="Nonce"
                      text="Nonce"
                      type="number"
                      component={TextField}
                      disabled={!areEthereumParamsVisible(parametersStatus)}
                    />
                    <Field
                      name="ethGasLimit"
                      defaultValue={ethGasLimit}
                      placeholder="Gas limit"
                      text="Gas limit"
                      type="number"
                      component={TextField}
                      disabled={parametersStatus === 'CANCEL_TRANSACTION'}
                    />
                    <Field
                      name="ethGasPrice"
                      defaultValue={ethGasPrice}
                      type="number"
                      placeholder="Gas price (GWEI)"
                      text="Gas price (GWEI)"
                      component={TextField}
                      disabled={!areEthereumParamsVisible(parametersStatus)}
                    />
                  </EthereumOptions>

                  <StyledLink
                    href="https://help.gnosis-safe.io/en/articles/4738445-configure-advanced-transaction-parameters-manually"
                    target="_blank"
                  >
                    <Text size="xl" color="primary">
                      How can I configure these parameters manually?
                    </Text>
                    <Icon size="sm" type="externalLink" color="primary" />
                  </StyledLink>
                </>
              )}

              <StyledDividerFooter />

              {/* Footer */}
              <Row align="center" className={classes.buttonRow}>
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onCloseFormHandler, text: 'Back' }}
                  confirmButtonProps={{
                    type: 'submit',
                    text: 'Confirm',
                    testId: 'submit-tx-btn',
                  }}
                />
              </Row>
            </>
          )}
        </GnoForm>
      </Block>
    </>
  )
}
