import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getNetworkInfo } from 'src/config'
import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { safeNameSelector, safeOwnersSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gas'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'

import { styles } from './style'

export const ADD_OWNER_SUBMIT_BTN_TEST_ID = 'add-owner-submit-btn'

const { nativeCoin } = getNetworkInfo()

const ReviewAddOwner = ({ classes, onClickBack, onClose, onSubmit, values }) => {
  const [gasCosts, setGasCosts] = useState('< 0.001')
  const safeAddress = useSelector(safeParamAddressFromStateSelector) as string
  const safeName = useSelector(safeNameSelector)
  const owners = useSelector(safeOwnersSelector)
  useEffect(() => {
    let isCurrent = true
    const estimateGas = async () => {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

      const txData = safeInstance.methods.addOwnerWithThreshold(values.ownerAddress, values.threshold).encodeABI()
      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, safeAddress, txData)

      const gasCosts = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
      const formattedGasCosts = formatAmount(gasCosts)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, values.ownerAddress, values.threshold])

  const handleSubmit = () => {
    onSubmit()
  }
  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>3 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
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
                  {`${values.threshold} out of ${(owners?.size || 0) + 1} owner(s)`}
                </Paragraph>
              </Block>
            </Block>
          </Col>
          <Col className={classes.owners} layout="column" xs={8}>
            <Row className={classes.ownersTitle}>
              <Paragraph color="primary" noMargin size="lg">
                {`${(owners?.size || 0) + 1} Safe owner(s)`}
              </Paragraph>
            </Row>
            <Hairline />
            {owners?.map((owner) => (
              <React.Fragment key={owner.address}>
                <Row className={classes.owner}>
                  <Col align="center" xs={1}>
                    <Identicon address={owner.address} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph noMargin size="lg" weight="bolder">
                        {owner.name}
                      </Paragraph>
                      <Block className={classes.user} justify="center">
                        <Paragraph className={classes.address} color="disabled" noMargin size="md">
                          {owner.address}
                        </Paragraph>
                        <CopyBtn content={owner.address} />
                        <EtherscanBtn value={owner.address} />
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Hairline />
              </React.Fragment>
            ))}
            <Row align="center" className={classes.info}>
              <Paragraph color="primary" noMargin size="md" weight="bolder">
                ADDING NEW OWNER &darr;
              </Paragraph>
            </Row>
            <Hairline />
            <Row className={classes.selectedOwner}>
              <Col align="center" xs={1}>
                <Identicon address={values.ownerAddress} diameter={32} />
              </Col>
              <Col xs={11}>
                <Block className={classNames(classes.name, classes.userName)}>
                  <Paragraph noMargin size="lg" weight="bolder">
                    {values.ownerName}
                  </Paragraph>
                  <Block className={classes.user} justify="center">
                    <Paragraph className={classes.address} color="disabled" noMargin size="md">
                      {values.ownerAddress}
                    </Paragraph>
                    <CopyBtn content={values.ownerAddress} />
                    <EtherscanBtn value={values.ownerAddress} />
                  </Block>
                </Block>
              </Col>
            </Row>
            <Hairline />
          </Col>
        </Row>
      </Block>
      <Hairline />
      <Block className={classes.gasCostsContainer}>
        <Paragraph>
          You&apos;re about to create a transaction and will have to confirm it with your currently connected wallet.
          <br />
          {`Make sure you have ${gasCosts} (fee price) ${nativeCoin.name} in this wallet to fund this confirmation.`}
        </Paragraph>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClickBack}>
          Back
        </Button>
        <Button
          color="primary"
          minHeight={42}
          minWidth={140}
          onClick={handleSubmit}
          testId={ADD_OWNER_SUBMIT_BTN_TEST_ID}
          type="submit"
          variant="contained"
        >
          Submit
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles as any)(ReviewAddOwner)
