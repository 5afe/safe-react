// @flow
import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import { history } from '~/store'
import Block from '~/components/layout/Block'
import Modal from '~/components/Modal'
import Identicon from '~/components/Identicon'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import actions, { type Actions } from './actions'
import { secondary } from '~/theme/variables'
import { styles } from './style'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

type Props = Actions & {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
}

const RemoveSafeComponent = ({
  onClose, isOpen, classes, safeAddress, etherScanLink, safeName, removeSafe,
}: Props) => (
  <Modal title="Remove Safe" description="Remove the selected Safe" handleClose={onClose} open={isOpen}>
    <Row align="center" grow className={classes.heading}>
      <Paragraph className={classes.manage} noMargin weight="bolder">
        Remove Safe
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.close} />
      </IconButton>
    </Row>
    <Hairline />
    <Block className={classes.container}>
      <Row className={classes.owner}>
        <Col xs={1} align="center">
          <Identicon address={safeAddress} diameter={32} />
        </Col>
        <Col xs={11}>
          <Block className={classNames(classes.name, classes.userName)}>
            <Paragraph size="lg" noMargin weight="bolder">
              {safeName}
            </Paragraph>
            <Block align="center" className={classes.user}>
              <Paragraph size="md" color="disabled" noMargin>
                {safeAddress}
              </Paragraph>
              <Link className={classes.open} to={etherScanLink} target="_blank">
                <OpenInNew style={openIconStyle} />
              </Link>
            </Block>
          </Block>
        </Col>
      </Row>
      <Hairline />
      <Row className={classes.description}>
        <Paragraph noMargin>
          Removing a Safe only removes it from your interface.
          <b>It does not delete the Safe</b>
. You can always add it back using the Safe&apos;s address.
        </Paragraph>
      </Row>
    </Block>
    <Hairline />
    <Row align="center" className={classes.buttonRow}>
      <Button className={classes.button} minWidth={140} onClick={onClose}>
        Cancel
      </Button>
      <Button
        type="submit"
        className={classes.buttonRemove}
        onClick={() => {
          removeSafe(safeAddress)
          onClose()
          history.push(SAFELIST_ADDRESS)
        }}
        variant="contained"
        minWidth={140}
      >
        Remove
      </Button>
    </Row>
  </Modal>
)

const RemoveSafeModal = withStyles(styles)(RemoveSafeComponent)

export default connect(
  undefined,
  actions,
)(RemoveSafeModal)
