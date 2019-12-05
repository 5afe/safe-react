// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getNetwork } from '~/config'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import {
  xs, sm, md, border,
} from '~/theme/variables'

const network = getNetwork()

const useStyles = makeStyles({
  container: {
    flexGrow: 0,
    padding: `0 ${md}`,
  },
  text: {
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
      <Paragraph size="xs" className={classes.text}>
        {network}
      </Paragraph>
    </Col>
  )
}

export default EarlyAccessLabel
