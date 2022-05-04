import { ReactElement, ChangeEvent } from 'react'
import styled from 'styled-components'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { black300 } from 'src/theme/variables'
import { getChainById } from 'src/config'

type SafeAddressSelectorProps = {
  safes: AddressBookEntry[]
  value: string
  onChange: (event: ChangeEvent<{ value: string }>) => void
  shouldShowShortName?: boolean
  dataTestid?: string
}

const SafeAddressSelector = ({
  safes,
  value,
  onChange,
  shouldShowShortName = true,
  dataTestid,
}: SafeAddressSelectorProps): ReactElement => {
  return (
    <FormControl>
      <StyledSafeSelector
        data-testid={dataTestid || 'safe-selector'}
        value={value}
        onChange={onChange}
        autoWidth
        disableUnderline
        IconComponent={ExpandMore}
      >
        {safes.map((safe) => (
          <StyledMenuItem key={`${safe.address}-${safe.chainId}`} value={safe.address}>
            <EthHashInfo
              shouldShowShortName={shouldShowShortName}
              shortName={getChainById(safe.chainId).shortName}
              hash={safe.address}
              showAvatar
              shortenHash={4}
              name={safe.name}
            />
          </StyledMenuItem>
        ))}
      </StyledSafeSelector>
    </FormControl>
  )
}

export default SafeAddressSelector

const SELECTOR_WIDTH = 320

const StyledSafeSelector = styled(Select)`
  &.MuiInput-root {
    margin: 0;
    width: ${SELECTOR_WIDTH}px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.colors.separator};
    background-color: ${({ theme }) => theme.colors.white};
  }

  & .MuiSelect-select:focus {
    background-color: inherit;
  }

  & .MuiSelect-icon {
    right: 16px;
    color: ${black300};
  }
`

const StyledMenuItem = styled(MenuItem)`
  width: ${SELECTOR_WIDTH}px;
  padding: 12px;
`
