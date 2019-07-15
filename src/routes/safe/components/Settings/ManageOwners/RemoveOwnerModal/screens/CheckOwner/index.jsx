// @flow
import React from 'react'
import classNames from 'classnames/bind'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import Link from '~/components/layout/Link'
import Identicon from '~/components/Identicon'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { styles } from './style'
import { secondary } from '~/theme/variables'

export const REMOVE_OWNER_MODAL_NEXT_BTN_TESTID = 'remove-owner-next-btn'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

type Props = {
  onClose: () => void,
  classes: Object,
  ownerAddress: string,
  ownerName: string,
  network: string,
  onSubmit: Function,
}

const CheckOwner = ({
  classes,
  onClose,
  ownerAddress,
  ownerName,
  network,
  onSubmit,
}: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <React.Fragment>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Remove owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 3</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="md">
          <Paragraph>
            Review the owner you want to remove from the active Safe:
          </Paragraph>
        </Row>
        <Row className={classes.owner}>
          <Col xs={1} align="center">
            <Identicon address={ownerAddress} diameter={32} />
          </Col>
          <Col xs={7}>
            <Block className={classNames(classes.name, classes.userName)}>
              <Paragraph size="lg" noMargin weight="bolder">
                {ownerName}
              </Paragraph>
              <Block align="center" className={classes.user}>
                <Paragraph size="md" color="disabled" noMargin>
                  {ownerAddress}
                </Paragraph>
                <Link className={classes.open} to={getEtherScanLink(ownerAddress, network)} target="_blank">
                  <OpenInNew style={openIconStyle} />
                </Link>
              </Block>
            </Block>
          </Col>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button className={classes.button} minWidth={140} onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          minWidth={140}
          color="primary"
          onClick={handleSubmit}
          testId={REMOVE_OWNER_MODAL_NEXT_BTN_TESTID}
        >
          Next
        </Button>
      </Row>
    </React.Fragment>
  )
}

export default withStyles(styles)(CheckOwner)
