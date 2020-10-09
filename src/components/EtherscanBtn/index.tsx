import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'

import EtherscanOpenIcon from './img/etherscan-open.svg'

import Img from 'src/components/layout/Img'
import { xs } from 'src/theme/variables'
import { getExplorerInfo } from 'src/config'

const useStyles = makeStyles({
  container: {
    alignItems: 'center',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    margin: `0 ${xs}`,
    padding: '0',
    transition: 'background-color .2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F0EFEE',
    },
  },
  increasedPopperZindex: {
    zIndex: 2001,
  },
})

interface EtherscanBtnProps {
  className?: string
  increaseZindex?: boolean
  value: string
}

const EtherscanBtn = ({ className = '', increaseZindex = false, value }: EtherscanBtnProps): React.ReactElement => {
  const classes = useStyles()
  const customClasses = increaseZindex ? { popper: classes.increasedPopperZindex } : {}

  const explorerInfo = getExplorerInfo(value)
  const { url } = explorerInfo()

  return (
    <Tooltip classes={customClasses} placement="top" title="Show details on Etherscan">
      <a
        aria-label="Show details on Etherscan"
        className={cn(classes.container, className)}
        onClick={(event) => event.stopPropagation()}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Img alt="Show on Etherscan" height={20} src={EtherscanOpenIcon} />
      </a>
    </Tooltip>
  )
}

export default EtherscanBtn
