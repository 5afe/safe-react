import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement, useState } from 'react'

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
      component: <Modal.Header />,
      parameters: {
        title: 'The title that will be displayed in the modal',
        titleNote: 'An annotation for the title, like "1 of 2"',
        onClose: 'Callback to be called when attempt to close the modal',
      },
      compositionElements: [
        {
          title: 'Modal.Header.Title',
          component: <Modal.Header.Title size="xs">{}</Modal.Header.Title>,
          description: 'safe-react-component exposed with a few styles added to personalize the modal header',
        },
      ],
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
      compositionElements: [
        {
          title: 'Modal.Footer.Buttons',
          component: <Modal.Footer.Buttons />,
          description: 'standard two buttons wrapped implementation. One "Cancel" and one "Submit" button.',
        },
      ],
    },
  ],
}

const SimpleFormModal = ({ title, description, handleClose, handleSubmit, isOpen, children }) => (
  <Modal title={title} description={description} handleClose={handleClose} open={isOpen}>
    {/* header */}
    <Modal.Header onClose={handleClose}>
      <Modal.Header.Title>{title}</Modal.Header.Title>
    </Modal.Header>

    <GnoForm onSubmit={handleSubmit}>
      {() => (
        <>
          {/* body */}
          <Modal.Body>{children}</Modal.Body>

          {/* footer */}
          <Modal.Footer>
            <Modal.Footer.Buttons cancelButtonProps={{ text: 'Close', onClick: handleClose }} />
          </Modal.Footer>
        </>
      )}
    </GnoForm>
  </Modal>
)

const Username = () => (
  <label htmlFor="username">
    <Text size="lg" strong>
      Username
    </Text>
    <GnoField
      autoComplete="off"
      component={TextField}
      name="username"
      id="username"
      placeholder="your username"
      validate={required}
    />
  </label>
)

export const FormModal = (): ReactElement => {
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
      {/* Modal with Form */}
      <SimpleFormModal
        title="My first modal"
        description="My first modal description"
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
      >
        {/* Form Fields */}
        <Username />
      </SimpleFormModal>
    </div>
  )
}

export const RemoveSomething = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const title = 'Remove Something'

  const handleClose = () => {
    setIsOpen(false)
    console.log('modal closed')
  }

  const handleSubmit = () => {
    alert('Something was removed')
    handleClose()
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {/* Modal */}
      <Modal handleClose={handleClose} title={title} description={title} open={isOpen}>
        {/* Header */}
        <Modal.Header onClose={handleClose}>
          <Modal.Header.Title>{title}</Modal.Header.Title>
        </Modal.Header>

        {/* Body */}
        <Modal.Body>
          <Text size="md">You are about to remove something</Text>
        </Modal.Body>

        {/* Footer */}
        <Modal.Footer>
          <Modal.Footer.Buttons
            cancelButtonProps={{ onClick: handleClose }}
            confirmButtonProps={{ onClick: handleSubmit, color: 'error', text: 'Remove' }}
          />
        </Modal.Footer>
      </Modal>
    </div>
  )
}
