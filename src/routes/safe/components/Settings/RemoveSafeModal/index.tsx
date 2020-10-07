import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import OpenInNew from '@material-ui/icons/OpenInNew'
import classNames from 'classnames'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExplorerInfo } from 'src/config'

import { styles } from './style'

import Identicon from 'src/components/Identicon'
import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import removeSafe from 'src/logic/safe/store/actions/removeSafe'
import { safeNameSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { md, secondary } from 'src/theme/variables'

const openIconStyle = {
  height: md,
  color: secondary,
}

const useStyles = makeStyles(styles)

const RemoveSafeComponent = ({ isOpen, onClose }) => {
  const classes = useStyles()
  const safeAddress = useSelector(safeParamAddressFromStateSelector) as string
  const safeName = useSelector(safeNameSelector)
  const dispatch = useDispatch()
  const explorerInfo = getExplorerInfo(safeAddress)
  const { url } = explorerInfo()

  return (
    <Modal
      description="Remove the selected Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.modal}
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
          <Col align="center" xs={1}>
            <Identicon address={safeAddress} diameter={32} />
          </Col>
          <Col xs={11}>
            <Block className={classNames(classes.name, classes.userName)}>
              <Paragraph noMargin size="lg" weight="bolder">
                {safeName}
              </Paragraph>
              <Block className={classes.user} justify="center">
                <Paragraph color="disabled" noMargin size="md">
                  {safeAddress}
                </Paragraph>
                <Link className={classes.open} target="_blank" to={url}>
                  <OpenInNew style={openIconStyle} />
                </Link>
              </Block>
            </Block>
          </Col>
        </Row>
        <Hairline />
        <Row className={classes.description}>
          <Paragraph noMargin>
            Removing a Safe only removes it from your interface. <b>It does not delete the Safe</b>. You can always add
            it back using the Safe&apos;s address.
          </Paragraph>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={classes.buttonRemove}
          minWidth={140}
          onClick={() => {
            dispatch(removeSafe(safeAddress))
            onClose()
            // using native redirect in order to avoid problems in several components
            // trying to access references of the removed safe.
            window.location.href = '/app/'
          }}
          type="submit"
          variant="contained"
        >
          Remove
        </Button>
      </Row>
    </Modal>
  )
}

export const RemoveSafeModal = RemoveSafeComponent
