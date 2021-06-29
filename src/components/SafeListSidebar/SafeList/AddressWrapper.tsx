import { ButtonLink, EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import DefaultBadge from './DefaultBadge'
import { DefaultSafe } from 'src/logic/safe/store/reducer/types/safe'
import setDefaultSafe from 'src/logic/safe/store/actions/setDefaultSafe'
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
  safe: SafeRecordWithNames
  defaultSafeAddress: DefaultSafe
}

const { nativeCoin } = getNetworkInfo()

export const AddressWrapper = ({ safe, defaultSafeAddress }: Props): ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const setDefaultSafeAction = (safeAddress: string) => {
    dispatch(setDefaultSafe(safeAddress))
  }

  return (
    <div className={classes.wrapper}>
      <EthHashInfo hash={safe.address} name={safe.name} showAvatar shortenHash={4} />

      <div className={classes.addressDetails}>
        <Text size="xl">{`${formatAmount(safe.ethBalance)} ${nativeCoin.name}`}</Text>
        {sameAddress(defaultSafeAddress, safe.address) ? (
          <DefaultBadge />
        ) : (
          <StyledButtonLink
            className="safeListMakeDefaultButton"
            textSize="sm"
            onClick={() => {
              setDefaultSafeAction(safe.address)
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
