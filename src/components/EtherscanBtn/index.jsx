// @flow
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import Img from '~/components/layout/Img'
import { getEtherScanLink } from '~/logic/wallets/etherscan'
import { xs } from '~/theme/variables'
import SearchIcon from './search.svg'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: xs,
    borderRadius: '50%',
    transition: 'background-color .2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F0EFEE',
    },
  },
  inreasedPopperZindex: {
    zIndex: 2001,
  },
})

type EtherscanBtnProps = {
  type: 'tx' | 'address',
  value: string,
  increaseZindex?: boolean,
}

const EtherscanBtn = ({ type, value, increaseZindex = false }: EtherscanBtnProps) => {
  const classes = useStyles()
  const customClasses = increaseZindex ? { popper: classes.inreasedPopperZindex } : {}

  return (
    <Tooltip title="Show details on Etherscan" placement="top" classes={customClasses}>
      <a
        className={classes.container}
        href={getEtherScanLink(type, value)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Show details on Etherscan"
      >
        <Img src={SearchIcon} height={20} alt="Etherscan" />
      </a>
    </Tooltip>
  )
}

export default EtherscanBtn
