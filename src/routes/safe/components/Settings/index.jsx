// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import RemoveSafeModal from './RemoveSafeModal'
import Paragraph from '~/components/layout/Paragraph'

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
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  render() {
    const { showRemoveSafe } = this.state
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
        Settings page content
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Settings)
