// @flow
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import Img from '~/components/layout/Img'
import EtherscanOpenIcon from './img/etherscan-open.svg'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { xs } from '~/theme/variables'

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

type EtherscanBtnProps = {
  className?: any,
  increaseZindex?: boolean,
  type: 'tx' | 'address',
  value: string,
}

const EtherscanBtn = ({ type, value, className, increaseZindex = false }: EtherscanBtnProps) => {
  const classes = useStyles()
  const customClasses = increaseZindex ? { popper: classes.increasedPopperZindex } : {}

  return (
    <Tooltip title="Show details on Etherscan" placement="top" classes={customClasses}>
      <a
        aria-label="Show details on Etherscan"
        className={cn(classes.container, className)}
        href={getEtherScanLink(type, value)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Img src={EtherscanOpenIcon} height={20} alt="Show on Etherscan" />
      </a>
    </Tooltip>
  )
}

export default EtherscanBtn
