// @flow
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'
import Img from '~/components/layout/Img'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { xs } from '~/theme/variables'
import SearchIcon from './search.svg'

const styles = () => ({
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
})

type EtherscanBtnProps = {
  type: 'tx' | 'address',
  value: string,
  classes: Object,
}

const EtherscanBtn = ({
  type, value, classes,
}: EtherscanBtnProps) => (
  <Tooltip title="Show details on Etherscan" placement="top">
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

const EtherscanBtnWithStyles = withStyles(styles)(EtherscanBtn)

export default EtherscanBtnWithStyles
