import { withStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import classNames from 'classnames/bind'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { SAFE_VIEW_NAME_HEADING_TEST_ID } from 'src/routes/safe/components/Layout'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { safeNameSelector, safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'

const LayoutHeader = (props) => {
  const { classes, onShow, showSendFunds } = props
  const address = useSelector(safeParamAddressFromStateSelector)
  const granted = useSelector(grantedSelector)
  const name = useSelector(safeNameSelector)
  if (!address) return null

  return (
    <Block className={classes.container} margin="xl">
      <Row className={classes.userInfo}>
        <Identicon address={address} diameter={50} />
        <Block className={classes.name}>
          <Row>
            <Heading className={classes.nameText} color="primary" tag="h2" testId={SAFE_VIEW_NAME_HEADING_TEST_ID}>
              {name}
            </Heading>
            {!granted && <Block className={classes.readonly}>Read Only</Block>}
          </Row>
          <Block className={classes.user} justify="center">
            <Paragraph
              className={classes.address}
              color="disabled"
              noMargin
              size="md"
              data-testid="safe-address-heading"
            >
              {address}
            </Paragraph>
            <CopyBtn content={address} />
            <EtherscanBtn type="address" value={address} />
          </Block>
        </Block>
      </Row>
      <Block className={classes.balance}>
        <Button
          className={classes.send}
          color="primary"
          disabled={!granted}
          onClick={() => showSendFunds('')}
          size="small"
          variant="contained"
          testId="main-send-btn"
        >
          <CallMade
            alt="Send Transaction"
            className={classNames(classes.leftIcon, classes.iconSmall)}
            component={undefined}
          />
          Send
        </Button>
        <Button
          className={classes.receive}
          color="primary"
          onClick={onShow('Receive')}
          size="small"
          variant="contained"
        >
          <CallReceived
            alt="Receive Transaction"
            className={classNames(classes.leftIcon, classes.iconSmall)}
            component={undefined}
          />
          Receive
        </Button>
      </Block>
    </Block>
  )
}
export default withStyles(styles as any)(LayoutHeader)
