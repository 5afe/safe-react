import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/'

import { getNetworkInfo } from 'src/config'
import { NetworkInfo } from 'src/config/networks/network'
import { border, extraSmallFontSize, sm, xs, fontColor } from 'src/theme/variables'

type Props = {
  networkInfo?: NetworkInfo
  onClick?: () => void
  flexGrow?: boolean
}

function NetworkLabel({ networkInfo, onClick, flexGrow }: Props): ReactElement {
  const selectedNetwork = networkInfo || getNetworkInfo()
  const backgroundColor = selectedNetwork.backgroundColor
  const textColor = selectedNetwork.textColor
  const classes = useStyles({ onClick, backgroundColor, textColor, flexGrow })

  return (
    <span className={classes.root} onClick={onClick}>
      {selectedNetwork.label}
    </span>
  )
}

export default NetworkLabel

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    minWidth: '70px',
    fontSize: extraSmallFontSize,
    padding: `${xs} ${sm}`,
    backgroundColor: ({ backgroundColor }: any) => backgroundColor ?? border,
    color: ({ textColor }) => textColor ?? fontColor,
    cursor: ({ onClick }) => (onClick ? 'pointer' : 'inherit'),
    textAlign: 'center',
    borderRadius: '3px',
    textTransform: 'capitalize',
    flexGrow: ({ flexGrow }) => (flexGrow ? 1 : 'initial'),
  },
})
