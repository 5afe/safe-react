import { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { Text, Divider, Link, Icon } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import { styles } from './style'
import GnoForm from 'src/components/forms/GnoForm'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { composeValidators, maxValue, minValue } from 'src/components/forms/validator'
import { Modal } from 'src/components/Modal'
import {
  ParametersStatus,
  areSafeParamsEnabled,
  areEthereumParamsVisible,
  ethereumTxParametersTitle,
} from 'src/routes/safe/components/Transactions/helpers/utils'
import useSafeTxGas from 'src/routes/safe/components/Transactions/helpers/useSafeTxGas'
import { isMaxFeeParam } from 'src/logic/safe/transactions/gas'
import { extractSafeAddress } from 'src/routes/routes'
import useRecommendedNonce from 'src/logic/hooks/useRecommendedNonce'
import Paragraph from 'src/components/layout/Paragraph'

const StyledDivider = styled(Divider)`
  margin: 0;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 12px;
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
  margin: 0 0 16px 0;
`

const StyledTextMt = styled(Text)`
  margin: 16px 0;
`

const useStyles = makeStyles(styles)

interface Props {
  txParameters: TxParameters
  onClose: (txParameters?: TxParameters) => void
  parametersStatus: ParametersStatus
  isExecution: boolean
}

const formValidation = (values: Record<keyof TxParameters, string>): Record<string, number | string | undefined> => {
  const { ethGasLimit, ethGasPrice, ethMaxPrioFee, ethNonce, safeNonce, safeTxGas } = values ?? {}

  const ethGasLimitValidation = minValue(0, true)(ethGasLimit)

  const ethGasPriceValidation = minValue(0, true)(ethGasPrice)

  const ethMaxPrioFeeValidation = composeValidators(minValue(0, true), maxValue(ethGasPrice))(ethMaxPrioFee)

  const ethNonceValidation = minValue(0, true)(ethNonce)

  const safeNonceValidation = minValue(0, true)(safeNonce)

  const safeTxGasValidation = minValue(0, true)(safeTxGas)

  return {
    ethGasLimit: ethGasLimitValidation,
    ethGasPrice: ethGasPriceValidation,
    ethMaxPrioFee: ethMaxPrioFeeValidation,
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
  const { safeNonce, safeTxGas, ethNonce, ethGasLimit, ethGasPrice, ethMaxPrioFee } = txParameters
  const showSafeTxGas = useSafeTxGas()
  const safeAddress = extractSafeAddress()
  const recommendedNonce = useRecommendedNonce(safeAddress)

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
        <Paragraph size="xl" noMargin>
          Advanced parameters
        </Paragraph>
        <IconButton disableRipple onClick={onCloseFormHandler}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>

      <StyledDivider />

      <Block className={classes.container}>
        <GnoForm
          initialValues={{
            safeNonce: safeNonce || recommendedNonce || '0',
            safeTxGas: safeTxGas || '',
            ethNonce: ethNonce || '',
            ethGasLimit: ethGasLimit || '',
            ethGasPrice: ethGasPrice || '',
            ethMaxPrioFee: ethMaxPrioFee || '',
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
                  label="Safe nonce"
                  type="number"
                  min="0"
                  component={TextField}
                  disabled={!areSafeParamsEnabled(parametersStatus)}
                />
                {showSafeTxGas && (
                  <Field
                    name="safeTxGas"
                    defaultValue={safeTxGas}
                    placeholder="SafeTxGas"
                    label="SafeTxGas"
                    type="number"
                    min="0"
                    component={TextField}
                    disabled={!areSafeParamsEnabled(parametersStatus)}
                  />
                )}
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
                      label="Nonce"
                      type="number"
                      component={TextField}
                      disabled={!areEthereumParamsVisible(parametersStatus)}
                    />
                    <Field
                      name="ethGasLimit"
                      defaultValue={ethGasLimit}
                      placeholder="Gas limit"
                      label="Gas limit"
                      type="number"
                      component={TextField}
                      disabled={!areEthereumParamsVisible(parametersStatus)}
                    />
                    {((gasPriceText) => (
                      <Field
                        name="ethGasPrice"
                        defaultValue={ethGasPrice}
                        type="number"
                        placeholder={gasPriceText}
                        label={gasPriceText}
                        component={TextField}
                        disabled={!areEthereumParamsVisible(parametersStatus)}
                      />
                    ))(`${isMaxFeeParam() ? 'Max fee per gas' : 'Gas price'} (GWEI)`)}

                    {isMaxFeeParam() && (
                      <Field
                        name="ethMaxPrioFee"
                        defaultValue={ethMaxPrioFee}
                        type="number"
                        placeholder="Max priority fee"
                        label="Max priority fee (GWEI)"
                        component={TextField}
                        disabled={!areEthereumParamsVisible(parametersStatus)}
                      />
                    )}
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
