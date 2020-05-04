// @flow
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'

import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, maxValue, mustBeFloat } from '~/components/forms/validator'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { styles } from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { safeSelector } from '~/routes/safe/store/selectors'

const useStyles = makeStyles(styles)

const EthValue = ({ onSetMax }: { onSetMax: (string) => void }) => {
  const classes = useStyles()
  const { ethBalance } = useSelector(safeSelector)

  return (
    <>
      <Row className={classes.fullWidth} margin="xs">
        <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
          Value
        </Paragraph>
        <ButtonLink onClick={() => onSetMax(ethBalance)} weight="bold">
          Send max
        </ButtonLink>
      </Row>
      <Row margin="md">
        <Col>
          <Field
            className={classes.addressInput}
            component={TextField}
            inputAdornment={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
            }}
            name="value"
            placeholder="Value"
            text="Value"
            type="text"
            validate={composeValidators(mustBeFloat, maxValue(ethBalance))}
          />
        </Col>
      </Row>
    </>
  )
}

export default EthValue
