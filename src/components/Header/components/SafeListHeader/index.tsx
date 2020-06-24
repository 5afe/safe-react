import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'

import { SidebarContext } from 'src/components/Sidebar'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { safesCountSelector } from 'src/routes/safe/store/selectors'
import { border, md, screenSm, sm, xs } from 'src/theme/variables'

export const TOGGLE_SIDEBAR_BTN_TESTID = 'TOGGLE_SIDEBAR_BTN'

const useStyles = makeStyles({
  container: {
    flexGrow: 0,
    alignItems: 'center',
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

const { useContext } = React

const SafeListHeader = ({ safesCount }) => {
  const classes = useStyles()
  const { isOpen, toggleSidebar } = useContext(SidebarContext)

  return (
    <Col className={classes.container} middle="xs" start="xs">
      Safes
      <Paragraph className={classes.counter} size="xs" data-testid="safe-counter-heading">
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

export default connect(
  // $FlowFixMe
  (state) => ({ safesCount: safesCountSelector(state) }),
  null,
)(SafeListHeader)
