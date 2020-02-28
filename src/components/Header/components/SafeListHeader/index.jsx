// @flow
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'

import { SidebarContext } from '~/components/Sidebar'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import { safesCountSelector } from '~/routes/safe/store/selectors'
import { border, md, screenSm, sm, xs } from '~/theme/variables'

export const TOGGLE_SIDEBAR_BTN_TESTID = 'TOGGLE_SIDEBAR_BTN'

const useStyles = makeStyles({
  container: {
    flexGrow: 0,
    padding: `0 ${sm}`,
    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: md,
      paddingRight: md,
    },
  },
  counter: {
    background: border,
    borderRadius: '3px',
    lineHeight: 'normal',
    marginLeft: sm,
    padding: xs,
  },
  icon: {
    marginLeft: sm,
  },
})

type Props = {
  safesCount: number,
}

const { useContext } = React

const SafeListHeader = ({ safesCount }: Props) => {
  const classes = useStyles()
  const { isOpen, toggleSidebar } = useContext(SidebarContext)

  return (
    <Col className={classes.container} middle="xs" start="xs">
      Safes
      <Paragraph className={classes.counter} size="xs">
        {safesCount}
      </Paragraph>
      <IconButton
        aria-label="Expand Safe List"
        className={classes.icon}
        data-testid={TOGGLE_SIDEBAR_BTN_TESTID}
        onClick={toggleSidebar}
      >
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon color="secondary" />}
      </IconButton>
    </Col>
  )
}

export default connect<Object, Object, ?Function, ?Object>(
  // $FlowFixMe
  state => ({ safesCount: safesCountSelector(state) }),
  null,
)(SafeListHeader)
