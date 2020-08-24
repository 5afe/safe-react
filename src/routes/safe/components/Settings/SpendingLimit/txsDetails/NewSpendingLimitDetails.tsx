import React from 'react'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import { RESET_TIME_OPTIONS } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import useToken from 'src/routes/safe/components/Settings/SpendingLimit/hooks/useToken'
import { AddressInfo, ResetTimeInfo, TokenInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import { fromTokenUnit } from 'src/routes/safe/components/Settings/SpendingLimit/utils'
import { useStyles } from 'src/routes/safe/components/Settings/SpendingLimit/style'

interface TxDetailsProps {
  amount: string
  beneficiary: string
  resetTimeMin: string
  tokenAddress: string
}

const NewSpendingLimitDetails = ({
  amount,
  beneficiary,
  resetTimeMin,
  tokenAddress,
}: TxDetailsProps): React.ReactElement => {
  const classes = useStyles()
  const resetTimeLabel = React.useMemo(
    () => RESET_TIME_OPTIONS.find(({ value }) => +value === +resetTimeMin / 24 / 60)?.label ?? '',
    [resetTimeMin],
  )
  const tokenInfo = useToken(tokenAddress)

  return (
    <Block className={classes.container}>
      <Col margin="lg">
        <AddressInfo title="Beneficiary" address={beneficiary} />
      </Col>
      <Col margin="lg">
        {tokenInfo && <TokenInfo amount={fromTokenUnit(amount, tokenInfo.decimals)} title="Amount" token={tokenInfo} />}
      </Col>
      <Col margin="lg">
        <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
      </Col>
    </Block>
  )
}

export default NewSpendingLimitDetails
