import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'

import EtherscanOpenIcon from './img/etherscan-open.svg'

import Img from 'src/components/layout/Img'
import { getEtherScanLink } from 'src/logic/wallets/getWeb3'
import { xs } from 'src/theme/variables'

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

const EtherscanBtn = ({ className = '', increaseZindex = false, type, value }) => {
  const classes = useStyles()
  const customClasses = increaseZindex ? { popper: classes.increasedPopperZindex } : {}

  return (
    <Tooltip classes={customClasses} placement="top" title="Show details on Etherscan">
      <a
        aria-label="Show details on Etherscan"
        className={cn(classes.container, className)}
        href={getEtherScanLink(type, value)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Img alt="Show on Etherscan" height={20} src={EtherscanOpenIcon} />
      </a>
    </Tooltip>
  )
}

export default EtherscanBtn
