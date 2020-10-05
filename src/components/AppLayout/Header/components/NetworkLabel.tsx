import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { getNetworkId, getNetworkInfo } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { border, md, screenSm, sm, xs, fontColor } from 'src/theme/variables'

const interfaceNetwork = getNetworkId()
const formatNetwork = (network: number): string =>
  ETHEREUM_NETWORK[network][0].toUpperCase() + ETHEREUM_NETWORK[network].substring(1).toLowerCase()

const networkInfo = getNetworkInfo()

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
    background: `${networkInfo?.backgroundColor ?? border}`,
    color: `${networkInfo?.textColor ?? fontColor}`,
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
  network?: number
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
