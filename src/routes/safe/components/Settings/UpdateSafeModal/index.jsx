// @flow
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/styles'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import GnoForm from '~/components/forms/GnoForm'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import { styles } from './style'


type Props = {
  onClose: Function,
  classes: Object,

}

const UpdateSafeModal = ({ onClose, classes }: Props) => {
  const handleSubmit = () => {
    // Call the update safe method
    onClose()
  }

  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.headingText} weight="bolder" noMargin>
          Change required confirmations
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.modalContent}>
              <Row>
                <Paragraph>
                  Update now to take advantage of new features and the highest security standards available.
                </Paragraph>
                <Paragraph>
                  This update includes:
                  <ul>
                    <li>Compatibility with new asset types (ERC-721 / ERC-1155)</li>
                    <li>Improved interoperability with modules</li>
                    <li>Minor security improvements</li>
                  </ul>
                </Paragraph>
                <Paragraph>
                  You will need to confirm this update just like any other transaction. This means other owners will have to confirm the update in case more than one confirmation is required for this Safe.
                </Paragraph>
              </Row>
            </Block>
            <Hairline style={{ position: 'absolute', bottom: 85 }} />
            <Row align="center" className={classes.buttonRow}>
              <Button minWidth={140} onClick={onClose}>
                Back
              </Button>
              <Button type="submit" color="primary" minWidth={140} variant="contained">
                Update Safe
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(UpdateSafeModal)
