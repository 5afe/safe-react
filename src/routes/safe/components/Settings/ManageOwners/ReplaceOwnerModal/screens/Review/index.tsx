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
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

import { useStyles } from './style'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { Overline } from 'src/components/layout/Typography'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

export const REPLACE_OWNER_SUBMIT_BTN_TEST_ID = 'replace-owner-submit-btn'

type ReplaceOwnerProps = {
  onClose: () => void
  onClickBack: () => void
  onSubmit: (txParameters: TxParameters, delayExecution: boolean) => void
  owner: OwnerData
  newOwner: {
    address: string
    name: string
  }
}

export const ReviewReplaceOwnerModal = ({
  onClickBack,
  onClose,
  onSubmit,
  owner,
  newOwner,
}: ReplaceOwnerProps): React.ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')
  const {
    address: safeAddress,
    name: safeName,
    owners,
    threshold = 1,
    currentVersion: safeVersion,
  } = useSelector(currentSafeWithNames)
  const connectedWalletAddress = useSelector(userAccountSelector)

  useEffect(() => {
    let isCurrent = true

    const calculateReplaceOwnerData = async () => {
      try {
        const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
        const safeTx = await sdk.getSwapOwnerTx(
          { oldOwnerAddress: owner.address, newOwnerAddress: newOwner.address },
          { safeTxGas: 0 },
        )
        const txData = safeTx.data.data

        if (isCurrent) {
          setData(txData)
        }
      } catch (error) {
        logError(Errors._813, error.message)
      }
    }
    calculateReplaceOwnerData()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, safeVersion, connectedWalletAddress, owner.address, newOwner.address])

  return (
    <TxModalWrapper txData={data} onSubmit={onSubmit} onBack={onClickBack}>
      <ModalHeader onClose={onClose} title="Replace owner" subTitle={getStepTitle(2, 2)} />
      <Hairline />
      <Block margin="md">
        <Row className={classes.root}>
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
                  {`${threshold} out of ${owners?.length || 0} owner(s)`}
                </Paragraph>
              </Block>
            </Block>
          </Col>
          <Col className={classes.owners} layout="column" xs={8}>
            <Row className={classes.ownersTitle}>
              <Paragraph color="primary" noMargin size="lg">
                {`${owners?.length || 0} Safe owner(s)`}
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
            <Row className={classes.selectedOwnerRemoved} data-testid="remove-owner-review">
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
            <Row align="center" className={classes.info}>
              <Overline noMargin>ADDING NEW OWNER &darr;</Overline>
            </Row>
            <Hairline />
            <Row className={classes.selectedOwnerAdded} data-testid="add-owner-review">
              <Col align="center" xs={12}>
                <PrefixedEthHashInfo
                  hash={newOwner.address}
                  name={newOwner.name}
                  showCopyBtn
                  showAvatar
                  explorerUrl={getExplorerInfo(newOwner.address)}
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
