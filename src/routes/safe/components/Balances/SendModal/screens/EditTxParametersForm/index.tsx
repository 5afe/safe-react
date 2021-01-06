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
  justify-content: space-between;
  gap: 10px 20px;

  /* div:nth-child(3) {
    flex-flow: column nowrap;
  } */
`
const StyledLink = styled(Link)`
  margin-top: 10px;
  display: flex;
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

interface Props {
  txParameters: TxParameters
  onClose: () => void
}

const formValidation = (values) => {
  const { ethGasLimit, ethGasPrice, ethNonce, safeNonce, safeTxGas } = values ?? {}

  const ethGasLimitValidation = minValue(0, true)(ethGasLimit)

  const ethGasPriceValidation = minValue(0, true)(ethGasPrice)

  const ethNonceValidation = minValue(0, true)(ethNonce)

  const safeNonceValidation = minValue(0, true)(safeNonce)

  const safeTxGasValidation = composeValidators(minValue(0, true), (value: string) => {
    if (Number(value) < Number(ethGasLimit)) {
      return 'Lower than Ethereum gas limit.'
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

const EditTxParametersForm = ({ onClose, txParameters }: Props): React.ReactElement => {
  const classes = useStyles()
  const { safeNonce, safeTxGas, ethNonce, ethGasLimit, ethGasPrice } = txParameters
  return (
    <>
      {/* Header */}
      <Row align="center" className={classes.heading} grow data-testid="send-funds-review-step">
        <Title size="sm" withoutMargin>
          Advanced options
        </Title>
        <StyledIconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </StyledIconButton>
      </Row>

      <StyledDivider />

      <Block className={classes.container}>
        <GnoForm
          /* formMutators={formMutators} */
          initialValues={{
            safeNonce: safeNonce || 0,
            safeTxGas: safeTxGas || '',
            ethNonce: ethNonce || '',
            ethGasLimit: ethGasLimit || '',
            ethGasPrice: ethGasPrice || '',
          }}
          onSubmit={() => {}}
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
                />
                <Field
                  name="safeTxGas"
                  defaultValue={safeTxGas}
                  placeholder="SafeTxGas"
                  text="SafeTxGas"
                  type="number"
                  min="0"
                  component={TextField}
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
                />
                <Field
                  name="ethGasLimit"
                  defaultValue={ethGasLimit}
                  placeholder="Ethereum gas limit"
                  text="Ethereum gas limit"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="ethGasPrice"
                  defaultValue={ethGasPrice}
                  type="number"
                  placeholder="Ethereum gas price (GWEI)"
                  text="Ethereum gas price (GWEI)"
                  component={TextField}
                />
              </EthereumOptions>
            </>
          )}
        </GnoForm>

        <StyledLink
          href="https://docs.gnosis.io/safe/docs/contracts_tx_execution/#safe-transaction-gas-limit-estimation"
          target="_blank"
        >
          <Text size="lg" color="primary">
            How can I configure the gas price manually?
          </Text>
          <Icon size="sm" type="externalLink" color="primary" />
        </StyledLink>
      </Block>

      <StyledDivider />

      {/* Footer */}
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={onClose}>
          Back
        </Button>
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="submit-tx-btn"
          /* disabled={!data} */
          minWidth={140}
          /* onClick={submitTx} */
          /* type="submit" */
          variant="contained"
          onClick={onClose}
        >
          Confirm
        </Button>
      </Row>
    </>
  )
}

export default EditTxParametersForm
