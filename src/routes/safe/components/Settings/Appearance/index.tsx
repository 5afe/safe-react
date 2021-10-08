import { Switch, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import Block from 'src/components/layout/Block'
import useDarkMode from 'src/logic/darkMode/hooks/useDarkMode'
import { lg } from 'src/theme/variables'
import styled from 'styled-components'

const StyledBlock = styled(Block)`
  padding: ${lg};
`

const Appearance = (): ReactElement => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  return (
    <StyledBlock>
      <Title size="xs" withoutMargin>
        Dark Mode
      </Title>
      <Switch checked={isDarkMode} onChange={toggleDarkMode} />
    </StyledBlock>
  )
}

export default Appearance
