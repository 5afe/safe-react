// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import {
  xs, sm, md, border,
} from '~/theme/variables'

export const TOGGLE_SIDEBAR_BTN_TESTID = 'TOGGLE_SIDEBAR_BTN'

const useStyles = makeStyles({
  container: {
    flexGrow: 0,
    padding: `0 ${md}`,
  },
  counter: {
    background: border,
    padding: `${xs} ${sm}`,
    borderRadius: '3px',
    marginLeft: sm,
    lineHeight: 'normal',
  },
})

const EarlyAccessLabel = () => {
  const classes = useStyles()

  return (
    <Col start="xs" middle="xs" className={classes.container}>
      <Paragraph size="xs" className={classes.counter}>
        Early access
      </Paragraph>
    </Col>
  )
}

export default EarlyAccessLabel
