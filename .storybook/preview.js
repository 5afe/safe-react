import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { addDecorator } from '@storybook/react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'

import { aNewStore } from 'src/store'
import Inter from 'src/assets/fonts/Inter-normal.woff2'
import InterBold from 'src/assets/fonts/Inter-ExtraBold.woff2'

const GlobalStyles = createGlobalStyle`
   @font-face {
        font-family: 'Inter';
        src: local('Inter'), local('Inter Bold'),
        url(${Inter}) format('woff2'),
        url(${InterBold}) format('woff');
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
