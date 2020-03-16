// @flow
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import * as React from 'react'

import Receive from './Receive'
import Tokens from './Tokens'
import { styles } from './style'

import Modal from '~/components/Modal'
import { SafeVersionContext } from '~/components/SafeVersionProvider'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Divider from '~/components/layout/Divider'
import Row from '~/components/layout/Row'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import { type Token } from '~/logic/tokens/store/model/token'
import Coins from '~/routes/safe/components/Balances/Coins'
import Collectibles from '~/routes/safe/components/Balances/Collectibles'
import SendModal from '~/routes/safe/components/Balances/SendModal'
import DropdownCurrency from '~/routes/safe/components/DropdownCurrency'

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

type State = {
  sendFunds: Object,
  showCoins: boolean,
  showCollectibles: boolean,
  showReceive: boolean,
  showToken: boolean,
  showManageCollectibleModal: boolean,
}

type Props = {
  activateTokensByBalance: Function,
  activateAssetsByBalance: Function,
  activeTokens: List<Token>,
  classes: Object,
  createTransaction: Function,
  currencySelected: string,
  currencyValues: BalanceCurrencyType[],
  ethBalance: string,
  fetchCurrencyValues: Function,
  fetchTokens: Function,
  granted: boolean,
  safeAddress: string,
  safeName: string,
  tokens: List<Token>,
}

type Action = 'Token' | 'Send' | 'Receive' | 'ManageCollectibleModal'

class Balances extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      showToken: false,
      showManageCollectibleModal: false,
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
      showCoins: true,
      showCollectibles: false,
      showReceive: false,
    }
    props.fetchTokens()
  }

  componentDidMount(): void {
    const { activateAssetsByBalance, activateTokensByBalance, fetchCurrencyValues, safeAddress } = this.props
    fetchCurrencyValues(safeAddress)
    activateTokensByBalance(safeAddress)
    activateAssetsByBalance(safeAddress)
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  showSendFunds = (tokenAddress: string) => {
    this.setState({
      sendFunds: {
        isOpen: true,
        selectedToken: tokenAddress,
      },
    })
  }

  hideSendFunds = () => {
    this.setState({
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
    })
  }

  showCoinsList = () => {
    this.setState({ showCoins: true })
  }

  hideCoinsList = () => {
    this.setState({ showCoins: false })
  }

  showCollectiblesList = () => {
    this.setState({ showCollectibles: true })
  }

  hideCollectiblesList = () => {
    this.setState({ showCollectibles: false })
  }

  viewCoins = () => {
    const { showCoins } = this.state

    if (showCoins) {
      return
    }

    this.hideCollectiblesList()
    this.showCoinsList()
  }

  viewCollectibles = () => {
    const { showCollectibles } = this.state

    if (showCollectibles) {
      return
    }

    this.hideCoinsList()
    this.showCollectiblesList()
  }

  render() {
    const { sendFunds, showCoins, showCollectibles, showManageCollectibleModal, showReceive, showToken } = this.state
    const { activeTokens, classes, createTransaction, ethBalance, safeAddress, safeName } = this.props

    return (
      <SafeVersionContext.Consumer>
        {value => {
          const erc721Enabled = !value.featuresEnabled.includes('ERC721')
          return (
            <>
              <Row align="center" className={classes.controls}>
                <Col className={classes.assetTabs} sm={6} start="sm" xs={12}>
                  <ButtonLink
                    className={showCoins ? classes.assetSectionButtonActive : ''}
                    color={!showCoins ? 'medium' : 'secondary'}
                    onClick={this.viewCoins}
                    size="md"
                    testId="coins-assets-btn"
                    weight={showCoins ? 'bold' : 'regular'}
                  >
                    Coins
                  </ButtonLink>
                  {erc721Enabled && (
                    <>
                      <Divider className={classes.assetDivider} />
                      <ButtonLink
                        className={showCollectibles ? classes.assetTabActive : ''}
                        color={!showCollectibles ? 'medium' : 'secondary'}
                        onClick={this.viewCollectibles}
                        size="md"
                        testId="collectible-assets-btn"
                        weight={showCollectibles ? 'bold' : 'regular'}
                      >
                        Collectibles
                      </ButtonLink>
                    </>
                  )}
                </Col>
                <Col className={classes.tokenControls} end="sm" sm={6} xs={12}>
                  {showCoins && <DropdownCurrency />}
                  <ButtonLink
                    className={classes.manageTokensButton}
                    onClick={showCollectibles ? this.onShow('ManageCollectibleModal') : this.onShow('Token')}
                    size="lg"
                    testId="manage-tokens-btn"
                  >
                    Manage List
                  </ButtonLink>
                  <Modal
                    description={
                      showCollectibles
                        ? 'Enable and disables assets to be listed'
                        : 'Enable and disable tokens to be listed'
                    }
                    handleClose={
                      showManageCollectibleModal ? this.onHide('ManageCollectibleModal') : this.onHide('Token')
                    }
                    open={showToken || showManageCollectibleModal}
                    title="Manage List"
                  >
                    <Tokens
                      modalScreen={showManageCollectibleModal ? 'assetsList' : 'tokenList'}
                      onClose={
                        showManageCollectibleModal ? this.onHide('ManageCollectibleModal') : this.onHide('Token')
                      }
                      safeAddress={safeAddress}
                    />
                  </Modal>
                </Col>
              </Row>
              {showCoins && <Coins showReceiveFunds={this.onShow('Receive')} showSendFunds={this.showSendFunds} />}
              {showCollectibles && <Collectibles />}
              <SendModal
                activeScreenType="sendFunds"
                createTransaction={createTransaction}
                ethBalance={ethBalance}
                isOpen={sendFunds.isOpen}
                onClose={this.hideSendFunds}
                safeAddress={safeAddress}
                safeName={safeName}
                selectedToken={sendFunds.selectedToken}
                tokens={activeTokens}
              />
              <Modal
                description="Receive Tokens Form"
                handleClose={this.onHide('Receive')}
                open={showReceive}
                paperClassName={classes.receiveModal}
                title="Receive Tokens"
              >
                <Receive onClose={this.onHide('Receive')} safeAddress={safeAddress} safeName={safeName} />
              </Modal>
            </>
          )
        }}
      </SafeVersionContext.Consumer>
    )
  }
}

export default withStyles(styles)(Balances)
