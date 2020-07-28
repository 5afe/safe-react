import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { getNetwork } from 'src/config'
import { border, md, screenSm, sm, xs } from 'src/theme/variables'

const interfaceNetwork = getNetwork()
const formatNetwork = (network: string): string => network[0].toUpperCase() + network.substring(1).toLowerCase()

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

interface NetworkLabelProps {
  network?: string
}

const NetworkLabel = ({ network = interfaceNetwork }: NetworkLabelProps): React.ReactElement => {
  const classes = useStyles()
  const formattedNetwork = formatNetwork(network)

  return (
    <Col className={classes.container} middle="xs" start="xs">
      <Paragraph className={classes.text} size="xs">
        {formattedNetwork}
      </Paragraph>
    </Col>
  )
}

export default NetworkLabel
