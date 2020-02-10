// @flow
import * as React from 'react'
import cn from 'classnames'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import { OwnersIcon } from './assets/icons/OwnersIcon'
import { RequiredConfirmationsIcon } from './assets/icons/RequiredConfirmationsIcon'
import { SafeDetailsIcon } from './assets/icons/SafeDetailsIcon'
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
    const { showRemoveSafe, menuOptionIndex } = this.state
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
                <SafeDetailsIcon />
                Safe details
              </Row>
              <Hairline />
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)}
                onClick={this.handleChange(2)}
                testId={OWNERS_SETTINGS_TAB_TEST_ID}
              >
                <OwnersIcon />
                Owners
                <Paragraph size="xs" className={classes.counter}>
                  {owners.size}
                </Paragraph>
              </Row>
              <Hairline />
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 3 && classes.active)}
                onClick={this.handleChange(3)}
              >
                <RequiredConfirmationsIcon />
                Policies
              </Row>
              <Hairline />
            </Block>
          </Col>
          <Col xs={9} layout="column">
            <Block className={classes.container}>
              {menuOptionIndex === 1 && (
                <SafeDetails safeAddress={safeAddress} safeName={safeName} updateSafe={updateSafe} createTransaction={createTransaction} />
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

export default connect(undefined, actions)(settingsComponent)
