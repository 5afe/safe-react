import React from 'react'
import { addDecorator } from '@storybook/react'
import { ThemeProvider } from 'styled-components'

import { theme } from '@gnosis.pm/safe-react-components'

addDecorator((storyFn) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>)
