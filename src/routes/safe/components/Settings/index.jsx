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
import RemoveSafeModal from './RemoveSafeModal'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import { type Owner } from '~/routes/safe/store/models/owner'
import ChangeSafeName from './ChangeSafeName'
import ThresholdSettings from './ThresholdSettings'
import ManageOwners from './ManageOwners'
import actions, { type Actions } from './actions'
import { styles } from './style'
import RemoveSafeIcon from './assets/icons/bin.svg'

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
  updateSafe: Function,
  userAddress: string,
}

type Action = 'RemoveSafe'

class Settings extends React.Component<Props, State> {
  state = {
    showRemoveSafe: false,
    menuOptionIndex: 1,
  }

  handleChange = menuOptionIndex => () => {
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
    } = this.props

    return (
      <React.Fragment>
        <Row align="center" className={classes.message}>
          <Col xs={6}>
            <Paragraph className={classes.settings} size="lg" weight="bolder">
              Settings
            </Paragraph>
          </Col>
          <Col xs={6} end="sm">
            <Paragraph noMargin size="md" color="error" onClick={this.onShow('RemoveSafe')}>
              <Span className={cn(classes.links, classes.removeSafeText)}>
                Remove Safe
              </Span>
              <Img alt="Trash Icon" className={classes.removeSafeIcon} src={RemoveSafeIcon} />
            </Paragraph>
            <RemoveSafeModal
              onClose={this.onHide('RemoveSafe')}
              isOpen={showRemoveSafe}
              etherScanLink={etherScanLink}
              safeAddress={safeAddress}
              safeName={safeName}
            />
          </Col>
        </Row>
        <Block className={classes.root}>
          <Col xs={3} layout="column">
            <Block className={classes.menu}>
              <Row
                className={cn(classes.menuOption, menuOptionIndex === 1 && classes.active)}
                onClick={this.handleChange(1)}
              >
                Safe name
              </Row>
              <Hairline />
              {granted && (
                <React.Fragment>
                  <Row
                    className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)}
                    onClick={this.handleChange(2)}
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
                </React.Fragment>
              )}
            </Block>
          </Col>
          <Col xs={9} layout="column">
            <Block className={classes.container}>
              {menuOptionIndex === 1 && (
                <ChangeSafeName safeAddress={safeAddress} safeName={safeName} updateSafe={updateSafe} />
              )}
              {granted && menuOptionIndex === 2 && (
                <ManageOwners
                  owners={owners}
                  threshold={threshold}
                  safeAddress={safeAddress}
                  safeName={safeName}
                  network={network}
                  createTransaction={createTransaction}
                  userAddress={userAddress}
                />
              )}
              {granted && menuOptionIndex === 3 && (
                <ThresholdSettings
                  owners={owners}
                  threshold={threshold}
                  createTransaction={createTransaction}
                  safeAddress={safeAddress}
                />
              )}
            </Block>
          </Col>
        </Block>
      </React.Fragment>
    )
  }
}

const settingsComponent = withStyles(styles)(Settings)

export default connect(
  undefined,
  actions,
)(settingsComponent)
