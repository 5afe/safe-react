import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useState } from 'react'

import TextField from 'src/components/forms/TextField'
import GnoField from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import { required } from 'src/components/forms/validator'

import { Modal } from '.'

export default {
  title: 'Modal',
  component: Modal,
  parameters: {
    children: 'The body of the modal or the whole modal being composed by `Modal.Header` and `Modal.Footer` components',
    title: 'The title, useful for screen readers',
    description: 'A description, useful for screen readers',
    handleClose:
      'A callback which will be called when an action to close the modal is triggered (Esc, clicking outside, etc)',
    open: 'If `true`, the modal will be displayed. Hidden otherwise.',
  },
  compositionElements: [
    {
      title: 'Modal.Header',
      component: <Modal.Header title="hello" />,
      parameters: {
        title: 'The title that will be displayed in the modal',
        titleNote: 'An annotation for the title, like "1 of 2"',
        onClose: 'Callback to be called when attempt to close the modal',
      },
    },
    {
      title: 'Modal.Header',
      component: <Modal.Body>{}</Modal.Body>,
      parameters: {
        children: 'whatever is required to be rendered in the footer. Usually buttons.',
        noPadding: 'a flag that will set padding to 0 (zero) in case it is needed',
      },
    },
    {
      title: 'Modal.Footer',
      component: <Modal.Footer>{}</Modal.Footer>,
      parameters: {
        children: 'whatever is required to be rendered in the footer. Usually buttons.',
      },
    },
  ],
}

export const Base = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
    console.log('modal closed')
  }

  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2))
    console.log('form submitted', values)
    handleClose()
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal title="My first modal" description="My first modal description" handleClose={handleClose} open={isOpen}>
        {/* header */}
        <Modal.Header title="My first modal" onClose={handleClose} />

        <GnoForm onSubmit={handleSubmit}>
          {() => (
            <>
              {/* body */}
              <Modal.Body>
                <Text size="lg" strong>
                  Username
                </Text>
                <GnoField
                  autoComplete="off"
                  component={TextField}
                  name="username"
                  placeholder="your username"
                  validate={required}
                  required
                />
              </Modal.Body>

              {/* footer */}
              <Modal.Footer>
                <button onClick={handleClose} type="button">
                  close
                </button>
                <button type="submit">submit</button>
              </Modal.Footer>
            </>
          )}
        </GnoForm>
      </Modal>
    </div>
  )
}
