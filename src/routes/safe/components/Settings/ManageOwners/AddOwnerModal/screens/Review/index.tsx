import { makeStyles } from '@material-ui/core/styles'
import { ReactElement, useEffect, useState, Fragment } from 'react'
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

import { OwnerValues } from '../..'
import { styles } from './style'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { Overline } from 'src/components/layout/Typography'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

const useStyles = makeStyles(styles)

type ReviewAddOwnerProps = {
  onClickBack: () => void
  onClose: () => void
  onSubmit: (txParameters: TxParameters, delayExecution: boolean) => void
  values: OwnerValues
}

export const ReviewAddOwner = ({ onClickBack, onClose, onSubmit, values }: ReviewAddOwnerProps): ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')
  const {
    address: safeAddress,
    name: safeName,
    owners,
    currentVersion: safeVersion,
  } = useSelector(currentSafeWithNames)
  const connectedWalletAddress = useSelector(userAccountSelector)

  useEffect(() => {
    let isCurrent = true

    const calculateAddOwnerData = async () => {
      try {
        const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
        const safeTx = await sdk.getAddOwnerTx(
          { ownerAddress: values.ownerAddress, threshold: +values.threshold },
          { safeTxGas: 0 },
        )
        const txData = safeTx.data.data

        if (isCurrent) {
          setData(txData)
        }
      } catch (error) {
        logError(Errors._811, error.message)
      }
    }
    calculateAddOwnerData()

    return () => {
      isCurrent = false
    }
  }, [connectedWalletAddress, safeAddress, safeVersion, values.ownerAddress, values.threshold])

  return (
    <TxModalWrapper txData={data} onSubmit={onSubmit} onBack={onClickBack}>
      <ModalHeader onClose={onClose} title="Add new owner" subTitle={getStepTitle(3, 3)} />
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
                  {`${values.threshold} out of ${(owners?.length || 0) + 1} owner(s)`}
                </Paragraph>
              </Block>
            </Block>
          </Col>
          <Col className={classes.owners} layout="column" xs={8}>
            <Row className={classes.ownersTitle}>
              <Paragraph color="primary" noMargin size="lg">
                {`${(owners?.length || 0) + 1} Safe owner(s)`}
              </Paragraph>
            </Row>
            <Hairline />
            {owners?.map((owner) => (
              <Fragment key={owner.address}>
                <Row className={classes.owner}>
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
              </Fragment>
            ))}
            <Row align="center" className={classes.info}>
              <Overline noMargin>ADDING NEW OWNER &darr;</Overline>
            </Row>
            <Hairline />
            <Row className={classes.selectedOwner} data-testid="add-owner-review">
              <Col align="center" xs={12}>
                <PrefixedEthHashInfo
                  hash={values.ownerAddress}
                  name={values.ownerName}
                  showCopyBtn
                  showAvatar
                  explorerUrl={getExplorerInfo(values.ownerAddress)}
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
