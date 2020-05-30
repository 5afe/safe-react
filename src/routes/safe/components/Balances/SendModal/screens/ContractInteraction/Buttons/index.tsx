import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useField, useFormState } from 'react-final-form'

import Button from 'src/components/layout/Button'
import Row from 'src/components/layout/Row'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { createTxObject } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'

const useStyles = makeStyles(styles as any)

const Buttons = ({ onCallSubmit, onClose }) => {
  const classes = useStyles()
  const {
    input: { value: method },
  } = useField('selectedMethod', { value: true })
  const {
    input: { value: contractAddress },
  } = useField('contractAddress', { valid: true } as any)
  const { modifiedSinceLastSubmit, submitError, submitting, valid, validating, values } = useFormState({
    subscription: {
      modifiedSinceLastSubmit: true,
      submitError: true,
      submitting: true,
      valid: true,
      values: true,
      validating: true,
    },
  })

  const handleCallSubmit = async () => {
    const results = await createTxObject(method, contractAddress, values).call()
    onCallSubmit(results)
  }

  return (
    <Row align="center" className={classes.buttonRow}>
      <Button minWidth={140} onClick={onClose}>
        Cancel
      </Button>
      {method && (method as any).action === 'read' ? (
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="review-tx-btn"
          disabled={validating || !valid}
          minWidth={140}
          onClick={handleCallSubmit}
          variant="contained"
        >
          Call
        </Button>
      ) : (
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="review-tx-btn"
          disabled={
            submitting ||
            validating ||
            ((!valid || !!submitError) && !modifiedSinceLastSubmit) ||
            !method ||
            (method as any).action === 'read'
          }
          minWidth={140}
          type="submit"
          variant="contained"
        >
          Review
        </Button>
      )}
    </Row>
  )
}

export default Buttons
