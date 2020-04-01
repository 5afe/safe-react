// @flow
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { List } from 'immutable'
import * as React from 'react'
import { connect } from 'react-redux'

import ManageOwners from './ManageOwners'
import RemoveSafeModal from './RemoveSafeModal'
import SafeDetails from './SafeDetails'
import ThresholdSettings from './ThresholdSettings'
import actions, { type Actions } from './actions'
import { OwnersIcon } from './assets/icons/OwnersIcon'
import { RequiredConfirmationsIcon } from './assets/icons/RequiredConfirmationsIcon'
import { SafeDetailsIcon } from './assets/icons/SafeDetailsIcon'
import RemoveSafeIcon from './assets/icons/bin.svg'
import { styles } from './style'

import Block from '~/components/layout/Block'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Span from '~/components/layout/Span'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'
import { type Owner } from '~/routes/safe/store/models/owner'
import type { Safe } from '~/routes/safe/store/models/safe'

export const OWNERS_SETTINGS_TAB_TEST_ID = 'owner-settings-tab'

type State = {
  showRemoveSafe: boolean,
  menuOptionIndex: number,
}

type Props = Actions & {
  addSafeOwner: Function,
  addressBook: AddressBook,
  classes: Object,
  createTransaction: Function,
  editSafeOwner: Function,
  etherScanLink: string,
  granted: boolean,
  network: string,
  owners: List<Owner>,
  removeSafeOwner: Function,
  replaceSafeOwner: Function,
  safe: Safe,
  safeAddress: string,
  safeName: string,
  threshold: number,
  updateAddressBookEntry: Function,
  updateSafe: Function,
  userAddress: string,
}

type Action = 'RemoveSafe'

class Settings extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      showRemoveSafe: false,
      menuOptionIndex: 1,
    }
  }

  handleChange = (menuOptionIndex) => () => {
    this.setState({ menuOptionIndex })
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  render() {
    const { menuOptionIndex, showRemoveSafe } = this.state
    const {
      addSafeOwner,
      addressBook,
      classes,
      createTransaction,
      editSafeOwner,
      etherScanLink,
      granted,
      network,
      owners,
      removeSafeOwner,
      replaceSafeOwner,
      safe,
      safeAddress,
      safeName,
      threshold,
      updateAddressBookEntry,
      updateSafe,
      userAddress,
    } = this.props

    return (
      <>
        <Row className={classes.message}>
          <ButtonLink className={classes.removeSafeBtn} color="error" onClick={this.onShow('RemoveSafe')} size="lg">
            <Span className={classes.links}>Remove Safe</Span>
            <Img alt="Trash Icon" className={classes.removeSafeIcon} src={RemoveSafeIcon} />
          </ButtonLink>
          <RemoveSafeModal
            etherScanLink={etherScanLink}
            isOpen={showRemoveSafe}
            onClose={this.onHide('RemoveSafe')}
            safeAddress={safeAddress}
            safeName={safeName}
          />
        </Row>
        <Block className={classes.root}>
          <Col className={classes.menuWrapper} layout="column">
            <Block className={classes.menu}>
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 1 && classes.active)}
                onClick={this.handleChange(1)}
              >
                <SafeDetailsIcon />
                <Badge
                  badgeContent=" "
                  color="error"
                  invisible={!safe.needsUpdate || !granted}
                  style={{ paddingRight: '10px' }}
                  variant="dot"
                >
                  Safe details
                </Badge>
              </Row>
              <Hairline className={classes.hairline} />
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)}
                onClick={this.handleChange(2)}
                testId={OWNERS_SETTINGS_TAB_TEST_ID}
              >
                <OwnersIcon />
                Owners
                <Paragraph className={classes.counter} size="xs">
                  {owners.size}
                </Paragraph>
              </Row>
              <Hairline className={classes.hairline} />
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 3 && classes.active)}
                onClick={this.handleChange(3)}
              >
                <RequiredConfirmationsIcon />
                Policies
              </Row>
              <Hairline className={classes.hairline} />
            </Block>
          </Col>
          <Col className={classes.contents} layout="column">
            <Block className={classes.container}>
              {menuOptionIndex === 1 && (
                <SafeDetails
                  createTransaction={createTransaction}
                  safeAddress={safeAddress}
                  safeCurrentVersion={safe.currentVersion}
                  safeName={safeName}
                  safeNeedsUpdate={safe.needsUpdate}
                  updateSafe={updateSafe}
                />
              )}
              {menuOptionIndex === 2 && (
                <ManageOwners
                  addressBook={addressBook}
                  addSafeOwner={addSafeOwner}
                  createTransaction={createTransaction}
                  editSafeOwner={editSafeOwner}
                  granted={granted}
                  network={network}
                  owners={owners}
                  removeSafeOwner={removeSafeOwner}
                  replaceSafeOwner={replaceSafeOwner}
                  safe={safe}
                  safeAddress={safeAddress}
                  safeName={safeName}
                  threshold={threshold}
                  updateAddressBookEntry={updateAddressBookEntry}
                  userAddress={userAddress}
                />
              )}
              {menuOptionIndex === 3 && (
                <ThresholdSettings
                  createTransaction={createTransaction}
                  granted={granted}
                  owners={owners}
                  safeAddress={safeAddress}
                  threshold={threshold}
                />
              )}
            </Block>
          </Col>
        </Block>
      </>
    )
  }
}

const settingsComponent = withStyles(styles)(Settings)

export default connect(undefined, actions)(settingsComponent)
