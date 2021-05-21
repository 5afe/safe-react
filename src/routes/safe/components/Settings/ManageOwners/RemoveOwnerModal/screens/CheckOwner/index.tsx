import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import React, { ReactElement } from 'react'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

import { useStyles } from './style'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { getExplorerInfo } from 'src/config'
import { Modal } from 'src/components/Modal'

export const REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID = 'remove-owner-next-btn'

interface CheckOwnerProps {
  onClose: () => void
  onSubmit: () => void
  ownerAddress: string
  ownerName: string
}

export const CheckOwner = ({ onClose, onSubmit, ownerAddress, ownerName }: CheckOwnerProps): ReactElement => {
  const classes = useStyles()

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
        <Row>
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
      <Modal.Footer>
        <Modal.Footer.Buttons
          cancelButtonProps={{ onClick: onClose }}
          confirmButtonProps={{ onClick: onSubmit, testId: REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID, text: 'Next' }}
        />
      </Modal.Footer>
    </>
  )
}
