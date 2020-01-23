// @flow
import * as React from 'react'
import cn from 'classnames'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Span from '~/components/layout/Span'
import Img from '~/components/layout/Img'
import ButtonLink from '~/components/layout/ButtonLink'
import RemoveSafeModal from './RemoveSafeModal'
import Hairline from '~/components/layout/Hairline'
import { type Owner } from '~/routes/safe/store/models/owner'
import SafeDetails from './SafeDetails'
import ThresholdSettings from './ThresholdSettings'
import ManageOwners from './ManageOwners'
import actions, { type Actions } from './actions'
import { styles } from './style'
import RemoveSafeIcon from './assets/icons/bin.svg'
import type { Safe } from '~/routes/safe/store/models/safe'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'

export const OWNERS_SETTINGS_TAB_TEST_ID = 'owner-settings-tab'

type State = {
  showRemoveSafe: boolean,
  menuOptionIndex: number,
}

type Props = Actions & {
  classes: Object,
  granted: boolean,
  etherScanLink: string,
  safeAddress: string,
  safeName: string,
  owners: List<Owner>,
  threshold: number,
  network: string,
  createTransaction: Function,
  addSafeOwner: Function,
  removeSafeOwner: Function,
  updateSafe: Function,
  replaceSafeOwner: Function,
  editSafeOwner: Function,
  userAddress: string,
  safe: Safe,
  addressBook: AddressBook,
  updateAddressBookEntry: Function,
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
    const { showRemoveSafe, menuOptionIndex } = this.state
    const {
      classes,
      granted,
      etherScanLink,
      safeAddress,
      safeName,
      threshold,
      owners,
      network,
      userAddress,
      createTransaction,
      updateSafe,
      addSafeOwner,
      removeSafeOwner,
      replaceSafeOwner,
      editSafeOwner,
      safe,
      addressBook,
      updateAddressBookEntry,
    } = this.props

    return (
      <>
        <Row className={classes.message}>
          <ButtonLink size="lg" color="error" className={classes.removeSafeBtn} onClick={this.onShow('RemoveSafe')}>
            <Span className={classes.links}>Remove Safe</Span>
            <Img alt="Trash Icon" className={classes.removeSafeIcon} src={RemoveSafeIcon} />
          </ButtonLink>
          <RemoveSafeModal
            onClose={this.onHide('RemoveSafe')}
            isOpen={showRemoveSafe}
            etherScanLink={etherScanLink}
            safeAddress={safeAddress}
            safeName={safeName}
          />
        </Row>
        <Block className={classes.root}>
          <Col xs={3} layout="column">
            <Block className={classes.menu}>
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 1 && classes.active)}
                onClick={this.handleChange(1)}
              >
                Safe details
              </Row>
              <Hairline />
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)}
                onClick={this.handleChange(2)}
                testId={OWNERS_SETTINGS_TAB_TEST_ID}
              >
                Owners (
                {owners.size}
)
              </Row>
              <Hairline />
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 3 && classes.active)}
                onClick={this.handleChange(3)}
              >
                Required confirmations
              </Row>
              <Hairline />
            </Block>
          </Col>
          <Col xs={9} layout="column">
            <Block className={classes.container}>
              {menuOptionIndex === 1 && (
                <SafeDetails safeAddress={safeAddress} safeName={safeName} updateSafe={updateSafe} />
              )}
              {menuOptionIndex === 2 && (
                <ManageOwners
                  owners={owners}
                  threshold={threshold}
                  safeAddress={safeAddress}
                  safeName={safeName}
                  network={network}
                  createTransaction={createTransaction}
                  userAddress={userAddress}
                  addSafeOwner={addSafeOwner}
                  removeSafeOwner={removeSafeOwner}
                  replaceSafeOwner={replaceSafeOwner}
                  editSafeOwner={editSafeOwner}
                  granted={granted}
                  safe={safe}
                  addressBook={addressBook}
                  updateAddressBookEntry={updateAddressBookEntry}
                />
              )}
              {menuOptionIndex === 3 && (
                <ThresholdSettings
                  owners={owners}
                  threshold={threshold}
                  createTransaction={createTransaction}
                  safeAddress={safeAddress}
                  granted={granted}
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

export default connect(
  undefined,
  actions,
)(settingsComponent)
