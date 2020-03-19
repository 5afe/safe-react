// @flow
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import * as React from 'react'

import Receive from './Receive'
import Tokens from './Tokens'
import { styles } from './style'

import Modal from '~/components/Modal'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Divider from '~/components/layout/Divider'
import Link from '~/components/layout/Link'
import Row from '~/components/layout/Row'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import { type Token } from '~/logic/tokens/store/model/token'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import Coins from '~/routes/safe/components/Balances/Coins'
import Collectibles from '~/routes/safe/components/Balances/Collectibles'
import SendModal from '~/routes/safe/components/Balances/SendModal'
import DropdownCurrency from '~/routes/safe/components/DropdownCurrency'
import { history } from '~/store'

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

type State = {
  erc721Enabled: boolean,
  subMenuOptions: string[],
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
  blacklistedTokens: List<Token>,
  classes: Object,
  createTransaction: Function,
  currencySelected: string,
  currencyValues: BalanceCurrencyType[],
  ethBalance: string,
  featuresEnabled: string[],
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
      erc721Enabled: false,
      subMenuOptions: [],
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

  static isCoinsLocation = /\/balances\/?$/
  static isCollectiblesLocation = /\/balances\/collectibles$/

  componentDidMount(): void {
    const { activateAssetsByBalance, activateTokensByBalance, fetchCurrencyValues, safeAddress } = this.props
    fetchCurrencyValues(safeAddress)
    activateTokensByBalance(safeAddress)
    activateAssetsByBalance(safeAddress)

    const showCollectibles = Balances.isCollectiblesLocation.test(history.location.pathname)
    const showCoins = Balances.isCoinsLocation.test(history.location.pathname)

    if (!showCollectibles && !showCoins) {
      history.replace(`${SAFELIST_ADDRESS}/${this.props.safeAddress}/balances`)
    }

    const subMenuOptions = [
      { enabled: showCoins, legend: 'Coins', url: `${SAFELIST_ADDRESS}/${this.props.safeAddress}/balances` },
    ]
    const erc721Enabled = this.props.featuresEnabled.includes('ERC721')

    if (erc721Enabled) {
      subMenuOptions.push({
        enabled: showCollectibles,
        legend: 'Collectibles',
        url: `${SAFELIST_ADDRESS}/${this.props.safeAddress}/balances/collectibles`,
      })
    } else {
      if (showCollectibles) {
        history.replace(subMenuOptions[0].url)
      }
    }

    this.setState({
      showCoins,
      showCollectibles,
      erc721Enabled,
      subMenuOptions,
    })
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

  render() {
    const {
      erc721Enabled,
      sendFunds,
      showCoins,
      showCollectibles,
      showManageCollectibleModal,
      showReceive,
      showToken,
      subMenuOptions,
    } = this.state
    const { activeTokens, classes, createTransaction, ethBalance, safeAddress, safeName } = this.props

    return (
      <>
        <Row align="center" className={classes.controls}>
          <Col className={classes.assetTabs} sm={6} start="sm" xs={12}>
            {subMenuOptions.length > 1 &&
              subMenuOptions.map(({ enabled, legend, url }, index) => (
                <React.Fragment key={`legend-${index}`}>
                  {index > 0 && <Divider className={classes.assetDivider} />}
                  <Link
                    className={enabled ? classes.assetTabActive : classes.assetTab}
                    data-testid={`${legend.toLowerCase()}'-assets-btn'`}
                    size="md"
                    to={url}
                    weight={enabled ? 'bold' : 'regular'}
                  >
                    {legend}
                  </Link>
                </React.Fragment>
              ))}
          </Col>
          <Col className={classes.tokenControls} end="sm" sm={6} xs={12}>
            {showCoins && <DropdownCurrency />}
            <ButtonLink
              className={classes.manageTokensButton}
              onClick={erc721Enabled ? this.onShow('ManageCollectibleModal') : this.onShow('Token')}
              size="lg"
              testId="manage-tokens-btn"
            >
              Manage List
            </ButtonLink>
            <Modal
              description={
                erc721Enabled ? 'Enable and disables assets to be listed' : 'Enable and disable tokens to be listed'
              }
              handleClose={showManageCollectibleModal ? this.onHide('ManageCollectibleModal') : this.onHide('Token')}
              open={showToken || showManageCollectibleModal}
              title="Manage List"
            >
              <Tokens
                modalScreen={showManageCollectibleModal ? 'assetsList' : 'tokenList'}
                onClose={showManageCollectibleModal ? this.onHide('ManageCollectibleModal') : this.onHide('Token')}
                safeAddress={safeAddress}
              />
            </Modal>
          </Col>
        </Row>
        {showCoins && <Coins showReceiveFunds={this.onShow('Receive')} showSendFunds={this.showSendFunds} />}
        {erc721Enabled && showCollectibles && <Collectibles />}
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
  }
}

export default withStyles(styles)(Balances)
