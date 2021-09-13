import * as React from 'react'
import { getNetworkInfo } from 'src/config'
import { xs } from 'src/theme/variables'
import { CircleDot } from './CircleDot'
import { createStyles, makeStyles } from '@material-ui/styles'
import Paragraph from 'src/components/layout/Paragraph'

const styles = createStyles({
  dot: {
    marginRight: xs,
    height: '15px',
    width: '15px',
  },
  labels: {
    fontSize: '12px',
    letterSpacing: '0.5px',
  },
})

const useStyles = makeStyles(styles)

const NetworkCircle = (): React.ReactElement => {
  const selectedNetwork = getNetworkInfo()
  const networkLabel = selectedNetwork.label
  const classes = useStyles()

  return (
    <>
      {networkLabel && <CircleDot networkId={selectedNetwork.id} className={classes.dot} />}
      <Paragraph align="right" className={classes.labels} noMargin weight="bolder">
        {networkLabel || 'unknown'}
      </Paragraph>
    </>
  )
}

export default NetworkCircle
