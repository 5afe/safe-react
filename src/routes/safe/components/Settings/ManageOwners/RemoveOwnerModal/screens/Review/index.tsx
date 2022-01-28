import { useEffect, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

import { useStyles } from './style'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { logError } from 'src/logic/exceptions/CodedException'
import ErrorCodes from 'src/logic/exceptions/registry'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { Overline } from 'src/components/layout/Typography'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

type ReviewRemoveOwnerProps = {
  onClickBack: () => void
  onClose: () => void
  onSubmit: (txParameters: TxParameters, delayExecution: boolean) => void
  owner: OwnerData
  threshold?: number
}

export const ReviewRemoveOwnerModal = ({
  onClickBack,
  onClose,
  onSubmit,
  owner,
  threshold = 1,
}: ReviewRemoveOwnerProps): React.ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')
  const {
    address: safeAddress,
    name: safeName,
    owners,
    currentVersion: safeVersion,
  } = useSelector(currentSafeWithNames)
  const connectedWalletAddress = useSelector(userAccountSelector)
  const numOptions = owners ? owners.length - 1 : 0

  useEffect(() => {
    let isCurrent = true

    if (!threshold) {
      console.error("Threshold value was not define, tx can't be executed")
      return
    }

    const calculateRemoveOwnerData = async () => {
      try {
        const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
        const safeTx = await sdk.getRemoveOwnerTx(
          { ownerAddress: owner.address, threshold: +threshold },
          { safeTxGas: 0 },
        )
        const txData = safeTx.data.data

        if (isCurrent) {
          setData(txData)
        }
      } catch (error) {
        logError(ErrorCodes._812, error.message)
      }
    }
    calculateRemoveOwnerData()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, safeVersion, connectedWalletAddress, owner.address, threshold])

  return (
    <TxModalWrapper txData={data} onSubmit={onSubmit} onBack={onClickBack}>
      <ModalHeader onClose={onClose} title="Remove owner" subTitle={getStepTitle(3, 3)} />
      <Hairline />
      <Block margin="md">
        <Row className={classes.root}>
          {/* Details */}
          <Col layout="column" xs={4}>
            <Block className={classes.details}>
              <Block margin="lg">
                <Paragraph color="primary" noMargin size="lg">
                  Details
                </Paragraph>
              </Block>
              <Block margin="lg">
                <Paragraph color="disabled" noMargin size="sm">
                  Safe name
                </Paragraph>
                <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                  {safeName}
                </Paragraph>
              </Block>
              <Block margin="lg">
                <Paragraph color="disabled" noMargin size="sm">
                  Any transaction requires the confirmation of:
                </Paragraph>
                <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                  {`${threshold} out of ${numOptions} owner(s)`}
                </Paragraph>
              </Block>
            </Block>
          </Col>
          {/* Owners */}
          <Col className={classes.owners} layout="column" xs={8}>
            <Row className={classes.ownersTitle}>
              <Paragraph color="primary" noMargin size="lg">
                {`${numOptions} Safe owner(s)`}
              </Paragraph>
            </Row>
            <Hairline />
            {owners?.map(
              (safeOwner) =>
                !sameAddress(safeOwner.address, owner.address) && (
                  <Fragment key={safeOwner.address}>
                    <Row className={classes.owner}>
                      <Col align="center" xs={12}>
                        <PrefixedEthHashInfo
                          hash={safeOwner.address}
                          name={safeOwner.name}
                          showCopyBtn
                          showAvatar
                          explorerUrl={getExplorerInfo(safeOwner.address)}
                        />
                      </Col>
                    </Row>
                    <Hairline />
                  </Fragment>
                ),
            )}
            <Row align="center" className={classes.info}>
              <Overline noMargin>REMOVING OWNER &darr;</Overline>
            </Row>
            <Hairline />
            <Row className={classes.selectedOwner} data-testid="remove-owner-review">
              <Col align="center" xs={12}>
                <PrefixedEthHashInfo
                  hash={owner.address}
                  name={owner.name}
                  showCopyBtn
                  showAvatar
                  explorerUrl={getExplorerInfo(owner.address)}
                />
              </Col>
            </Row>
            <Hairline />
          </Col>
        </Row>
        <Hairline />
      </Block>
    </TxModalWrapper>
  )
}
