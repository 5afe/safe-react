import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import { Title, Text, Divider, TextField, Link, Icon } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Row from 'src/components/layout/Row'
import { styles } from './style'
import GnoForm from 'src/components/forms/GnoForm'

const StyledDivider = styled(Divider)`
  margin: 0px;
`

const SafeOptions = styled.div`
  display: flex;
  justify-content: space-between;
`

const EthereumOptions = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  div:nth-child(3) {
    margin-top: 10px;
  }
`

const StyledTextField = styled(TextField)`
  width: 216px !important;
`

const StyledLink = styled(Link)`
  margin-top: 10px;
  display: flex;
  align-items: center;

  > :first-of-type {
    margin-right: 5px;
  }
`

const useStyles = makeStyles(styles)

interface Props {
  onClose: () => void
}

const AdvancedOptions = ({ onClose }: Props): React.ReactElement => {
  const classes = useStyles()

  return (
    <>
      {/* Header */}
      <Row align="center" className={classes.heading} grow data-testid="send-funds-review-step">
        <Title size="sm" withoutMargin>
          Send Funds
        </Title>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>

      <StyledDivider />

      <Block className={classes.container}>
        <GnoForm
          /* formMutators={formMutators} */
          /* initialValues={{ amount, recipientAddress, token: selectedToken }} */
          onSubmit={() => {}}
          /* validation={sendFundsValidation} */
        >
          {() => (
            <>
              <Text size="xl" strong>
                Safe transactions parameters
              </Text>

              <SafeOptions>
                <StyledTextField value="" label="Safe nonce" />
                <StyledTextField value="" label="SafeTxGas" />
              </SafeOptions>

              <Text size="xl" strong>
                Safe transactions parameters
              </Text>

              <EthereumOptions>
                <StyledTextField value="" label="Ethereum nonce" />
                <StyledTextField value="" label="Ethereum gas limite" />
                <StyledTextField value="" label="Ethereum gas price (GWEI)" />
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
          Submit
        </Button>
      </Row>
    </>
  )
}

export default AdvancedOptions
