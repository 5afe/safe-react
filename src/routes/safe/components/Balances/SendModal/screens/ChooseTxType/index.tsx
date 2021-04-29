import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames/bind'
import * as React from 'react'
import { useSelector } from 'react-redux'

import { mustBeEthereumContractAddress } from 'src/components/forms/validator'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { safeFeaturesEnabledSelector } from 'src/logic/safe/store/selectors'
import { useStyles } from 'src/routes/safe/components/Balances/SendModal/screens/ChooseTxType/style'
import ContractInteractionIcon from 'src/routes/safe/components/Transactions/TxList/assets/custom.svg'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

import Collectible from '../assets/collectibles.svg'
import Token from '../assets/token.svg'
import { FEATURES } from 'src/config/networks/network.d'

import { getExplorerInfo } from 'src/config'

type ActiveScreen = 'sendFunds' | 'sendCollectible' | 'contractInteraction'

interface ChooseTxTypeProps {
  onClose: () => void
  recipientAddress?: string
  recipientName?: string
  setActiveScreen: React.Dispatch<React.SetStateAction<ActiveScreen>>
}

const ChooseTxType = ({
  onClose,
  recipientAddress,
  recipientName,
  setActiveScreen,
}: ChooseTxTypeProps): React.ReactElement => {
  const classes = useStyles()
  const featuresEnabled = useSelector(safeFeaturesEnabledSelector)
  const erc721Enabled = featuresEnabled?.includes(FEATURES.ERC721)
  const contractInteractionEnabled = featuresEnabled?.includes(FEATURES.CONTRACT_INTERACTION)
  const [disableContractInteraction, setDisableContractInteraction] = React.useState(!!recipientAddress)

  React.useEffect(() => {
    let isCurrent = true
    const isContract = async () => {
      if (recipientAddress && isCurrent) {
        setDisableContractInteraction(!!(await mustBeEthereumContractAddress(recipientAddress)))
      }
    }

    isContract()

    return () => {
      isCurrent = false
    }
  }, [recipientAddress])

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Send
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      {!!recipientAddress && (
        <Row align="center" margin="md">
          <Col className={classes.disclaimer} layout="column" middle="xs">
            <Paragraph className={classes.disclaimerText} noMargin>
              Please select what you will send to
            </Paragraph>
            <EthHashInfo
              hash={recipientAddress}
              name={recipientName}
              showAvatar
              showCopyBtn
              explorerUrl={getExplorerInfo(recipientAddress)}
            />
          </Col>
        </Row>
      )}
      <Row align="center">
        <Col className={classes.buttonColumn} layout="column" middle="xs">
          <Button
            className={classes.firstButton}
            color="primary"
            minHeight={52}
            minWidth={240}
            onClick={() => setActiveScreen('sendFunds')}
            variant="contained"
            testId="modal-send-funds-btn"
          >
            <Img alt="Send funds" className={classNames(classes.leftIcon, classes.iconSmall)} src={Token} />
            Send funds
          </Button>
          {erc721Enabled && (
            <Button
              className={classes.firstButton}
              color="primary"
              minHeight={52}
              minWidth={240}
              onClick={() => setActiveScreen('sendCollectible')}
              variant="contained"
              testId="modal-send-collectible-btn"
            >
              <Img
                alt="Send collectible"
                className={classNames(classes.leftIcon, classes.iconSmall)}
                src={Collectible}
              />
              Send collectible
            </Button>
          )}
          {contractInteractionEnabled && (
            <Button
              color="primary"
              disabled={disableContractInteraction}
              minHeight={52}
              minWidth={240}
              onClick={() => setActiveScreen('contractInteraction')}
              variant="outlined"
              testId="modal-contract-interaction-btn"
            >
              <Img
                alt="Contract Interaction"
                className={classNames(classes.leftIcon, classes.iconSmall)}
                src={ContractInteractionIcon}
              />
              Contract interaction
            </Button>
          )}
        </Col>
      </Row>
    </>
  )
}

export default ChooseTxType
