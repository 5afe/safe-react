import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { addDecorator } from '@storybook/react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'

import { aNewStore } from 'src/store'

const GlobalStyles = createGlobalStyle`
   @font-face {
        font-family: 'IBM Plex Mono';
        src: local("IBM Plex Mono-Regular"),
    url('../../assets/fonts/IBMPlexMono-Regular.ttf') format("ttf");
    }
`

addDecorator((storyFn) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <GlobalStyles />
      <Provider store={aNewStore()}>
        {storyFn()}
      </Provider>
    </MemoryRouter>
  </ThemeProvider>
))
