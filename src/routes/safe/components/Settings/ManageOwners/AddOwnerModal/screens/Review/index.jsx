// @flow
import React from 'react'
import { List } from 'immutable'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Identicon from '~/components/Identicon'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import type { Owner } from '~/routes/safe/store/models/owner'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { secondary } from '~/theme/variables'
import { styles } from './style'

export const ADD_OWNER_SUBMIT_BTN_TEST_ID = 'add-owner-submit-btn'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

type Props = {
  onClose: () => void,
  classes: Object,
  safeName: string,
  owners: List<Owner>,
  network: string,
  values: Object,
  onClickBack: Function,
  onSubmit: Function,
}

const ReviewAddOwner = ({
  classes, onClose, safeName, owners, network, values, onClickBack, onSubmit,
}: Props) => {
  const handleSubmit = () => {
    onSubmit()
  }
  return (
    <React.Fragment>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>3 of 3</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <Row className={classes.root}>
          <Col xs={4} layout="column">
            <Block className={classes.details}>
              <Block margin="lg">
                <Paragraph size="lg" color="primary" noMargin>
                  Details
                </Paragraph>
              </Block>
              <Block margin="lg">
                <Paragraph size="sm" color="disabled" noMargin>
                  Safe name
                </Paragraph>
                <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
                  {safeName}
                </Paragraph>
              </Block>
              <Block margin="lg">
                <Paragraph size="sm" color="disabled" noMargin>
                  Any transaction requires the confirmation of:
                </Paragraph>
                <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
                  {values.threshold}
                  {' '}
                  out of
                  {' '}
                  {owners.size + 1}
                  {' '}
                  owner(s)
                </Paragraph>
              </Block>
            </Block>
          </Col>
          <Col xs={8} layout="column" className={classes.owners}>
            <Row className={classes.ownersTitle}>
              <Paragraph size="lg" color="primary" noMargin>
                {owners.size + 1}
                {' '}
                Safe owner(s)
              </Paragraph>
            </Row>
            <Hairline />
            {owners.map(owner => (
              <React.Fragment key={owner.address}>
                <Row className={classes.owner}>
                  <Col xs={1} align="center">
                    <Identicon address={owner.address} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph weight="bolder" size="lg" noMargin>
                        {owner.name}
                      </Paragraph>
                      <Block align="center" className={classes.user}>
                        <Paragraph size="md" color="disabled" noMargin>
                          {owner.address}
                        </Paragraph>
                        <Link className={classes.open} to={getEtherScanLink('address', owner.address, network)} target="_blank">
                          <OpenInNew style={openIconStyle} />
                        </Link>
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Hairline />
              </React.Fragment>
            ))}
            <Row className={classes.info} align="center">
              <Paragraph weight="bolder" noMargin color="primary" size="md">
                ADDING NEW OWNER &darr;
              </Paragraph>
            </Row>
            <Hairline />
            <Row className={classes.selectedOwner}>
              <Col xs={1} align="center">
                <Identicon address={values.ownerAddress} diameter={32} />
              </Col>
              <Col xs={11}>
                <Block className={classNames(classes.name, classes.userName)}>
                  <Paragraph weight="bolder" size="lg" noMargin>
                    {values.ownerName}
                  </Paragraph>
                  <Block align="center" className={classes.user}>
                    <Paragraph size="md" color="disabled" noMargin>
                      {values.ownerAddress}
                    </Paragraph>
                    <Link className={classes.open} to={getEtherScanLink('address', values.ownerAddress, network)} target="_blank">
                      <OpenInNew style={openIconStyle} />
                    </Link>
                  </Block>
                </Block>
              </Col>
            </Row>
            <Hairline />
          </Col>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button className={classes.button} minWidth={140} onClick={onClickBack}>
          Back
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          className={classes.button}
          variant="contained"
          minWidth={140}
          color="primary"
          testId={ADD_OWNER_SUBMIT_BTN_TEST_ID}
        >
          Submit
        </Button>
      </Row>
    </React.Fragment>
  )
}

export default withStyles(styles)(ReviewAddOwner)
