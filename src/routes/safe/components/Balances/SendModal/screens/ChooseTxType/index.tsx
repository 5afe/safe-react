import { Button } from '@gnosis.pm/safe-react-components'
import * as React from 'react'
import { useSelector } from 'react-redux'

import { ModalHeader } from 'src/components/ModalHeader'
import { mustBeEthereumContractAddress } from 'src/components/forms/validator'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { currentSafeFeaturesEnabled } from 'src/logic/safe/store/selectors'
import { useStyles } from 'src/routes/safe/components/Balances/SendModal/screens/ChooseTxType/style'

import { getExplorerInfo } from 'src/config'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { MODALS_EVENTS } from 'src/utils/events/modals'
import Track from 'src/components/Track'

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
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
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
      <ModalHeader onClose={onClose} title="Send" />
      <Hairline />
      {!!recipientAddress && (
        <Row align="center" margin="md">
          <Col className={classes.disclaimer} layout="column" middle="xs">
            <Paragraph className={classes.disclaimerText} noMargin>
              Please select what you will send to
            </Paragraph>
            <PrefixedEthHashInfo
              hash={recipientAddress}
              name={recipientName}
              strongName
              showAvatar
              showCopyBtn
              explorerUrl={getExplorerInfo(recipientAddress)}
            />
          </Col>
        </Row>
      )}
      <Row align="center">
        <Col className={classes.buttonColumn} layout="column" middle="xs">
          <Track {...MODALS_EVENTS.SEND_FUNDS}>
            <Button
              className={classes.firstButton}
              color="primary"
              iconType="assets"
              size="lg"
              onClick={() => setActiveScreen('sendFunds')}
              variant="contained"
              aria-labelledby="Send funds"
            >
              Send funds
            </Button>
          </Track>
          {erc721Enabled && (
            <Track {...MODALS_EVENTS.SEND_COLLECTIBLE}>
              <Button
                className={classes.firstButton}
                color="primary"
                iconType="collectibles"
                size="lg"
                onClick={() => setActiveScreen('sendCollectible')}
                variant="contained"
                aria-labelledby="Send NFT"
              >
                Send NFT
              </Button>
            </Track>
          )}
          {contractInteractionEnabled && (
            <Track {...MODALS_EVENTS.CONTRACT_INTERACTION}>
              <Button
                className={classes.lastButton}
                color="secondary"
                disabled={disableContractInteraction}
                iconType="code"
                size="lg"
                onClick={() => setActiveScreen('contractInteraction')}
                variant="bordered"
                aria-labelledby="Contract interaction"
              >
                Contract interaction
              </Button>
            </Track>
          )}
        </Col>
      </Row>
    </>
  )
}

export default ChooseTxType
