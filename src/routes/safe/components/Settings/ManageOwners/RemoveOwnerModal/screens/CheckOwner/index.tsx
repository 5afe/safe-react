import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'

import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

import { styles } from './style'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { getExplorerInfo } from 'src/config'

export const REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID = 'remove-owner-next-btn'

const CheckOwner = ({ classes, onClose, onSubmit, ownerAddress, ownerName }) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Remove owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="md">
          <Paragraph size="lg">Review the owner you want to remove from the active Safe:</Paragraph>
        </Row>
        <Row className={classes.owner}>
          <Col align="center" xs={12}>
            <EthHashInfo
              hash={ownerAddress}
              name={ownerName}
              showCopyBtn
              showAvatar
              explorerUrl={getExplorerInfo(ownerAddress)}
            />
          </Col>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          minHeight={42}
          minWidth={140}
          onClick={handleSubmit}
          testId={REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID}
          type="submit"
          variant="contained"
        >
          Next
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles as any)(CheckOwner)
