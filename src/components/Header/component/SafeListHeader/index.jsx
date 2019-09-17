// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import {
  xs, sm, md, border,
} from '~/theme/variables'
import { safesCountSelector } from '~/routes/safeList/store/selectors'
import { SidebarContext } from '~/components/Sidebar'

const useStyles = makeStyles({
  container: {
    flexGrow: 0,
    padding: `0 ${md}`,
  },
  counter: {
    background: border,
    padding: xs,
    borderRadius: '3px',
    marginLeft: sm,
    lineHeight: 'normal',
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
  const { toggleSidebar } = useContext(SidebarContext)

  return (
    <Col start="xs" middle="xs" className={classes.container}>
      Safes
      {' '}
      <Paragraph size="xs" className={classes.counter}>
        {safesCount}
      </Paragraph>
      <IconButton onClick={toggleSidebar} className={classes.icon} aria-label="Expand Safe List">
        <ExpandMoreIcon color="secondary" />
      </IconButton>
    </Col>
  )
}

export default connect<Object, Object, ?Function, ?Object>(
  // $FlowFixMe
  (state) => ({ safesCount: safesCountSelector(state) }),
  null,
)(SafeListHeader)
