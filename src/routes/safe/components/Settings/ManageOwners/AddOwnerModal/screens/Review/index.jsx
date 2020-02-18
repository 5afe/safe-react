// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Identicon from '~/components/Identicon'
import EtherscanBtn from '~/components/EtherscanBtn'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import CopyBtn from '~/components/CopyBtn'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import type { Owner } from '~/routes/safe/store/models/owner'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import { styles } from './style'

export const ADD_OWNER_SUBMIT_BTN_TEST_ID = 'add-owner-submit-btn'

type Props = {
  onClose: () => void,
  classes: Object,
  safeName: string,
  owners: List<Owner>,
  values: Object,
  onClickBack: Function,
  onSubmit: Function,
  safeAddress: string,
}

const ReviewAddOwner = ({ classes, onClose, safeName, owners, values, onClickBack, onSubmit, safeAddress }: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  useEffect(() => {
    let isCurrent = true
    const estimateGas = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

      const txData = safeInstance.contract.methods
        .addOwnerWithThreshold(values.ownerAddress, values.threshold)
        .encodeABI()
      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, safeAddress, txData)

      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [])

  const handleSubmit = () => {
    onSubmit()
  }
  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>3 of 3</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <Row className={classes.root}>
          <Col xs={4} layout="column">
            <Block className={classes.details}>
              <Block margin="lg">
                <Paragraph size="lg" color="primary" noMargin>
                  Details
                </Paragraph>
              </Block>
              <Block margin="lg">
                <Paragraph size="sm" color="disabled" noMargin>
                  Safe name
                </Paragraph>
                <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
                  {safeName}
                </Paragraph>
              </Block>
              <Block margin="lg">
                <Paragraph size="sm" color="disabled" noMargin>
                  Any transaction requires the confirmation of:
                </Paragraph>
                <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
                  {`${values.threshold} out of ${owners.size + 1} owner(s)`}
                </Paragraph>
              </Block>
            </Block>
          </Col>
          <Col xs={8} layout="column" className={classes.owners}>
            <Row className={classes.ownersTitle}>
              <Paragraph size="lg" color="primary" noMargin>
                {`${owners.size + 1} Safe owner(s)`}
              </Paragraph>
            </Row>
            <Hairline />
            {owners.map(owner => (
              <React.Fragment key={owner.address}>
                <Row className={classes.owner}>
                  <Col xs={1} align="center">
                    <Identicon address={owner.address} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph weight="bolder" size="lg" noMargin>
                        {owner.name}
                      </Paragraph>
                      <Block justify="center" className={classes.user}>
                        <Paragraph size="md" color="disabled" className={classes.address} noMargin>
                          {owner.address}
                        </Paragraph>
                        <CopyBtn content={owner.address} />
                        <EtherscanBtn type="address" value={owner.address} />
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Hairline />
              </React.Fragment>
            ))}
            <Row className={classes.info} align="center">
              <Paragraph weight="bolder" noMargin color="primary" size="md">
                ADDING NEW OWNER &darr;
              </Paragraph>
            </Row>
            <Hairline />
            <Row className={classes.selectedOwner}>
              <Col xs={1} align="center">
                <Identicon address={values.ownerAddress} diameter={32} />
              </Col>
              <Col xs={11}>
                <Block className={classNames(classes.name, classes.userName)}>
                  <Paragraph weight="bolder" size="lg" noMargin>
                    {values.ownerName}
                  </Paragraph>
                  <Block justify="center" className={classes.user}>
                    <Paragraph size="md" color="disabled" className={classes.address} noMargin>
                      {values.ownerAddress}
                    </Paragraph>
                    <CopyBtn content={values.ownerAddress} />
                    <EtherscanBtn type="address" value={values.ownerAddress} />
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
          {`Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
        </Paragraph>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} minHeight={42} onClick={onClickBack}>
          Back
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          minWidth={140}
          minHeight={42}
          color="primary"
          testId={ADD_OWNER_SUBMIT_BTN_TEST_ID}
        >
          Submit
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(ReviewAddOwner)
