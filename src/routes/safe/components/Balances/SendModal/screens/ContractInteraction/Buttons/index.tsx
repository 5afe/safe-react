import React from 'react'
import { useField, useFormState } from 'react-final-form'

import { ButtonStatus, Modal } from 'src/components/Modal'
import { isReadMethod } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'

export interface ButtonProps {
  onClose: () => void
}

const Buttons = ({ onClose }: ButtonProps): React.ReactElement => {
  const {
    input: { value: method },
  } = useField('selectedMethod', { subscription: { value: true } })
  const { modifiedSinceLastSubmit, submitError, submitting, valid, validating } = useFormState({
    subscription: {
      modifiedSinceLastSubmit: true,
      submitError: true,
      submitting: true,
      valid: true,
      validating: true,
    },
  })

  return (
    <Modal.Footer>
      <Modal.Footer.Buttons
        cancelButtonProps={{ onClick: onClose }}
        confirmButtonProps={{
          disabled: submitting || validating || ((!valid || !!submitError) && !modifiedSinceLastSubmit) || !method,
          status: submitting || validating ? ButtonStatus.LOADING : ButtonStatus.READY,
          testId: `${isReadMethod(method) ? 'call' : 'review'}-tx-btn`,
          text: isReadMethod(method) ? 'Call' : 'Review',
        }}
      />
    </Modal.Footer>
  )
}

export default Buttons
