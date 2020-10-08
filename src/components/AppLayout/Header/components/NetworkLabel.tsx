import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { getNetworkInfo } from 'src/config'
import { border, md, screenSm, sm, xs } from 'src/theme/variables'

const useStyles = makeStyles({
  container: {
    flexGrow: 0,
    padding: `0 ${sm}`,
    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: md,
      paddingRight: md,
    },
  },
  text: {
    background: border,
    borderRadius: '3px',
    lineHeight: 'normal',
    margin: '0',
    padding: `${xs} ${sm}`,

    [`@media (min-width: ${screenSm}px)`]: {
      marginLeft: '8px',
    },
  },
})

const NetworkLabel = (): React.ReactElement => {
  const classes = useStyles()
  const networkInfo = getNetworkInfo()

  return (
    <Col className={classes.container} middle="xs" start="xs">
      <Paragraph className={classes.text} size="xs">
        {networkInfo.label}
      </Paragraph>
    </Col>
  )
}

export default NetworkLabel
