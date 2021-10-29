import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { useDispatch, useSelector } from 'react-redux'

import { useStyles } from './style'
import Modal, { Modal as GenericModal } from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import removeSafe from 'src/logic/safe/store/actions/removeSafe'
import { getExplorerInfo } from 'src/config'
import Col from 'src/components/layout/Col'
import { WELCOME_ROUTE, history } from 'src/routes/routes'

type RemoveSafeModalProps = {
  isOpen: boolean
  onClose: () => void
}

const RemoveSafeModal = ({ isOpen, onClose }: RemoveSafeModalProps): React.ReactElement => {
  const classes = useStyles()
  const { address: safeAddress, name: safeName } = useSelector(currentSafeWithNames)
  const dispatch = useDispatch()

  const onRemoveSafeHandler = async () => {
    dispatch(removeSafe(safeAddress))
    onClose()
    history.push(WELCOME_ROUTE)
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
            <PrefixedEthHashInfo
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

export default RemoveSafeModal
