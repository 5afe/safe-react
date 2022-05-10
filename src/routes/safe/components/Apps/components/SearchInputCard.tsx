import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import styled from 'styled-components'
import { Card } from '@gnosis.pm/safe-react-components'
import { trackEvent } from 'src/utils/googleTagManager'
import { SAFE_APPS_EVENTS } from 'src/utils/events/safeApps'

const Container = styled(Card)`
  width: 100%;
  box-sizing: border-box;
`

type Props = {
  value: string
  onValueChange: (value: string) => void
}

const SearchInputCard = ({ value, onValueChange }: Props): React.ReactElement => (
  <Container>
    <Input
      inputProps={{
        'aria-label': 'search',
      }}
      startAdornment={<SearchIcon />}
      endAdornment={
        value && (
          <IconButton aria-label="Clear the search" onClick={() => onValueChange('')}>
            <ClearIcon />
          </IconButton>
        )
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value)}
      placeholder="e.g. Compound"
      value={value}
      style={{ width: '100%' }}
      onBlur={() => {
        if (value) {
          trackEvent({ ...SAFE_APPS_EVENTS.SEARCH, label: value })
        }
      }}
    />
  </Container>
)

export { SearchInputCard }
