import React from 'react'
import styled from 'styled-components'
import { ButtonLink, EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import DefaultBadge from './DefaultBadge'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { DefaultSafe } from 'src/routes/safe/store/reducer/types/safe'
import { SetDefaultSafe } from 'src/logic/safe/store/actions/setDefaultSafe'
import { makeStyles } from '@material-ui/core/styles'
import { getNetworkInfo } from 'src/config'

const StyledButtonLink = styled(ButtonLink)`
  visibility: hidden;
  white-space: nowrap;
`
const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    padding: '5px 0',
    width: '100%',
    justifyContent: 'space-between',
    '& > nth-child(2)': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  addressDetails: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '175px',
    '& div': {
      marginLeft: '0px',
      padding: '5px 20px',
      '& img': {
        marginRight: '5px',
      },
      '& p': {
        marginTop: '3px',
      },
    },
  },
})

type Props = {
  safe: SafeRecordProps
  defaultSafe: DefaultSafe
  setDefaultSafe: SetDefaultSafe
}

const { nativeCoin } = getNetworkInfo()

export const AddressWrapper = (props: Props): React.ReactElement => {
  const classes = useStyles()
  const { safe, defaultSafe, setDefaultSafe } = props

  return (
    <div className={classes.wrapper}>
      <EthHashInfo hash={safe.address} name={safe.name} showIdenticon shortenHash={4} />

      <div className={classes.addressDetails}>
        <Text size="xl">{`${formatAmount(safe.ethBalance)} ${nativeCoin.name}`}</Text>
        {sameAddress(defaultSafe, safe.address) ? (
          <DefaultBadge />
        ) : (
          <StyledButtonLink
            className="safeListMakeDefaultButton"
            textSize="sm"
            onClick={() => {
              setDefaultSafe(safe.address)
            }}
            color="primary"
          >
            Make default
          </StyledButtonLink>
        )}
      </div>
    </div>
  )
}
