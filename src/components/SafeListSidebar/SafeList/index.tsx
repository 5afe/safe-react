import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { EthHashInfo, Icon, Text, ButtonLink } from '@gnosis.pm/safe-react-components'
import * as React from 'react'
import styled from 'styled-components'

import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { DefaultSafe } from 'src/routes/safe/store/reducer/types/safe'
import { SetDefaultSafe } from 'src/logic/safe/store/actions/setDefaultSafe'
import { getNetworkName } from 'src/config'
import DefaultBadge from './DefaultBadge'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

export const SIDEBAR_SAFELIST_ROW_TESTID = 'SIDEBAR_SAFELIST_ROW_TESTID'

const StyledIcon = styled(Icon)`
  margin-right: 4px;
`
const AddressWrapper = styled.div`
  display: flex;
  padding: 5px 0;
  width: 100%;
  justify-content: space-between;

  > nth-child(2) {
    display: flex;
    align-items: center;
  }
`

const StyledButtonLink = styled(ButtonLink)`
  visibility: hidden;
  white-space: nowrap;
`

const AddressDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 175px;

  div {
    margin-left: 0px;
    padding: 5px 20px;

    img {
      margin-right: 5px;
    }

    p {
      margin-top: 3px;
    }
  }
`

const useStyles = makeStyles({
  list: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: 0,
  },
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover .safeListMakeDefaultButton': {
      visibility: 'initial',
    },
    '&:focus .safeListMakeDefaultButton': {
      visibility: 'initial',
    },
  },
  noIcon: {
    visibility: 'hidden',
    width: '28px',
  },
})

type Props = {
  currentSafe: string | undefined
  defaultSafe: DefaultSafe
  safes: SafeRecord[]
  onSafeClick: () => void
  setDefaultSafe: SetDefaultSafe
}

const SafeList = ({ currentSafe, defaultSafe, onSafeClick, safes, setDefaultSafe }: Props): React.ReactElement => {
  const classes = useStyles()

  return (
    <MuiList className={classes.list}>
      {safes.map((safe) => (
        <React.Fragment key={safe.address}>
          <Link
            data-testid={SIDEBAR_SAFELIST_ROW_TESTID}
            onClick={onSafeClick}
            to={`${SAFELIST_ADDRESS}/${safe.address}/balances`}
          >
            <ListItem classes={{ root: classes.listItemRoot }}>
              {sameAddress(currentSafe, safe.address) ? (
                <StyledIcon type="check" size="md" color="primary" />
              ) : (
                <div className={classes.noIcon}>placeholder</div>
              )}

              <AddressWrapper>
                <EthHashInfo
                  hash={safe.address}
                  name={safe.name}
                  showIdenticon
                  shortenHash={4}
                  network={getNetworkName()}
                />

                <AddressDetails>
                  <Text size="xl">{`${formatAmount(safe.ethBalance)} ETH`}</Text>
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
                </AddressDetails>
              </AddressWrapper>
            </ListItem>
          </Link>
          <Hairline />
        </React.Fragment>
      ))}
    </MuiList>
  )
}

export default SafeList
