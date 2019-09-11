// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Img from '~/components/layout/Img'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { xs } from '~/theme/variables'
import { networkSelector } from '~/logic/wallets/store/selectors'
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
  currentNetwork: string,
  classes: Object,
}

const EtherscanBtn = ({
  type, value, currentNetwork, classes,
}: EtherscanBtnProps) => (
  <a
    className={classes.container}
    href={getEtherScanLink(type, value, currentNetwork)}
    target="_blank"
    rel="noopener noreferrer"
    title="Show Details on etherscan"
    aria-label="Show Details on etherscan"
  >
    <Img src={SearchIcon} height={20} alt="Etherscan" />
  </a>
)

const EtherscanBtnWithStyles = withStyles(styles)(EtherscanBtn)

export default connect<Object, Object, ?Function, ?Object>(
  (state) => ({ currentNetwork: networkSelector(state) }),
  null,
)(EtherscanBtnWithStyles)
