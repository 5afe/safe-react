// @flow
import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Field from '~/components/forms/Field'
import {
  composeValidators, required, minMaxLength,
} from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import AddOwnerModal from './AddOwnerModal'
import { sm, boldFont } from '~/theme/variables'
import { styles } from './style'

const controlsStyle = {
  backgroundColor: 'white',
  padding: sm,
}

const addOwnerButtonStyle = {
  marginRight: sm,
  fontWeight: boldFont,
}

type Props = {
  classes: Object,
  safeAddress: string,
  safeName: string,
  owners: List<Owner>,
  network: string,
  userAddress: string,
  createTransaction: Function,
}

type Action = 'AddOwner'

class ManageOwners extends React.Component<Props, State> {
  state = {
    showAddOwner: false,
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  render() {
    const {
      classes,
      safeAddress,
      safeName,
      owners,
      threshold,
      network,
      userAddress,
      createTransaction,
    } = this.props
    const { showAddOwner } = this.state

    return (
      <React.Fragment>
        <Block className={classes.formContainer}>
          <Paragraph noMargin className={classes.title} size="lg" weight="bolder">
            Manage Safe Owners
          </Paragraph>
          <Row className={classes.header}>
            <Col xs={3}>NAME</Col>
            <Col xs={9}>ADDRESS</Col>
          </Row>
          <Hairline />
          <Block>
            {owners.map(owner => (
              <React.Fragment key={owner.get('address')}>
                <Row className={classes.owner}>
                  <Col xs={3}>
                    <Paragraph size="lg" noMargin>
                      {owner.get('name')}
                    </Paragraph>
                  </Col>
                  <Col xs={1} align="right">
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Identicon address={owner.get('address')} diameter={32} />
                    </Block>
                  </Col>
                  <Col xs={8}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Block align="center" className={classes.user}>
                        <Paragraph size="md" color="disabled" noMargin>
                          {owner.get('address')}
                        </Paragraph>
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Hairline />
              </React.Fragment>
            ))}
          </Block>
        </Block>
        <Hairline />
        <Row style={controlsStyle} align="end" grow>
          <Col end="xs">
            <Button
              style={addOwnerButtonStyle}
              size="small"
              variant="contained"
              color="primary"
              onClick={this.onShow('AddOwner')}
            >
              Add new owner
            </Button>
          </Col>
        </Row>
        <AddOwnerModal
          onClose={this.onHide('AddOwner')}
          isOpen={showAddOwner}
          safeAddress={safeAddress}
          safeName={safeName}
          owners={owners}
          threshold={threshold}
          network={network}
          userAddress={userAddress}
          createTransaction={createTransaction}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(ManageOwners)
