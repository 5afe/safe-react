import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useStyles } from './style'

import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import Modal, { Modal as GenericModal } from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import {
  defaultSafeSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/logic/safe/store/selectors'
import { WELCOME_ADDRESS } from 'src/routes/routes'
import { removeLocalSafe } from 'src/logic/safe/store/actions/removeLocalSafe'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { saveDefaultSafe } from 'src/logic/safe/utils'

import { getExplorerInfo } from 'src/config'
import Col from 'src/components/layout/Col'

type RemoveSafeModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const RemoveSafeModal = ({ isOpen, onClose }: RemoveSafeModalProps): React.ReactElement => {
  const classes = useStyles()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const safeName = useSelector(safeNameSelector)
  const defaultSafe = useSelector(defaultSafeSelector)
  const dispatch = useDispatch()

  const onRemoveSafeHandler = async () => {
    await dispatch(removeLocalSafe(safeAddress))
    if (sameAddress(safeAddress, defaultSafe)) {
      await saveDefaultSafe('')
    }

    onClose()
    // using native redirect in order to avoid problems in several components
    // trying to access references of the removed safe.
    const relativePath = window.location.href.split('/#/')[0]
    window.location.href = `${relativePath}/#/${WELCOME_ADDRESS}`
  }

  return (
    <Modal
      description="Remove the selected Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="modal"
      title="Remove Safe"
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Remove Safe
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row className={classes.owner}>
          <Col align="center" xs={12}>
            <EthHashInfo
              hash={safeAddress}
              name={safeName}
              showAvatar
              showCopyBtn
              explorerUrl={getExplorerInfo(safeAddress)}
            />
          </Col>
        </Row>
        <Row className={classes.description}>
          <Paragraph noMargin size="lg">
            Removing a Safe only removes it from your interface. <b>It does not delete the Safe</b>. You can always add
            it back using the Safe&apos;s address.
          </Paragraph>
        </Row>
      </Block>
      <GenericModal.Footer>
        <GenericModal.Footer.Buttons
          cancelButtonProps={{ onClick: onClose }}
          confirmButtonProps={{
            onClick: onRemoveSafeHandler,
            color: 'error',
            text: 'Remove',
          }}
        />
      </GenericModal.Footer>
    </Modal>
  )
}
