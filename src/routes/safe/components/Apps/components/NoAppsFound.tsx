import React from 'react'
import { Button, Text, Icon } from '@gnosis.pm/safe-react-components'
import InfoIcon from '@material-ui/icons/Info'
import styled from 'styled-components'

const ClearSearchButton = styled(Button)`
  &&.MuiButton-root {
    padding: 0 12px;
  }

  *:first-child {
    margin: 0 ${({ theme }) => theme.margin.xxs} 0 0;
  }
`

const NoAppsFoundTextContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.margin.xxl};
  margin-bottom: ${({ theme }) => theme.margin.xxl};

  & > svg {
    margin-right: ${({ theme }) => theme.margin.sm};
  }
`
type Props = {
  query: string
  handleSearchClear: () => void
}

const NoAppsFound = ({ query, handleSearchClear }: Props): React.ReactElement => (
  <>
    <NoAppsFoundTextContainer>
      <InfoIcon />
      <Text size="xl">
        No apps found matching <b>{query}</b>
      </Text>
    </NoAppsFoundTextContainer>
    <ClearSearchButton size="md" color="primary" variant="contained" onClick={handleSearchClear}>
      <Icon type="cross" size="sm" />
      <Text size="xl" color="white">
        Clear search
      </Text>
    </ClearSearchButton>
  </>
)

export { NoAppsFound }
