// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import RemoveSafeModal from './RemoveSafeModal'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import { styles } from './style'

type State = {
  showRemoveSafe: boolean,
}

type Props = {
  classes: Object,
  granted: boolean,
  etherScanLink: string,
  safeAddress: string,
  safeName: string,
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
    } = this.props

    return (
      <React.Fragment>
        <Row align="center" className={classes.message}>
          <Col xs={6}>
            <Paragraph className={classes.settings}>Settings</Paragraph>
          </Col>
          <Col xs={6} end="sm">
            <Paragraph noMargin size="md" color="error" className={classes.links} onClick={this.onShow('RemoveSafe')}>
              Remove Safe
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
              <Row className={classes.menuOption} onClick={this.handleChange(1)}>
                Safe name
              </Row>
              <Hairline />
              {granted && (
                <React.Fragment>
                  <Row className={classes.menuOption} onClick={this.handleChange(2)}>
                    Owners
                  </Row>
                  <Hairline />
                  <Row className={classes.menuOption} onClick={this.handleChange(3)}>
                    Required confirmations
                  </Row>
                  <Hairline />
                  <Row className={classes.menuOption} onClick={this.handleChange(4)}>
                    Modules
                  </Row>
                  <Hairline />
                </React.Fragment>
              )}
            </Block>
          </Col>
          <Col xs={9} layout="column">
            <Block className={classes.container}>
              {menuOptionIndex === 1 && (
                <p>To be done</p>
              )}
              {granted && menuOptionIndex === 2 && (
                <p>To be done</p>
              )}
              {granted && menuOptionIndex === 3 && (
                <p>To be done</p>
              )}
              {granted && menuOptionIndex === 4 && (
                <p>To be done</p>
              )}
            </Block>
          </Col>
        </Block>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Settings)
