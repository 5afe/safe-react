import 'babel-polyfill'
import { addDecorator, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { MuiThemeProvider } from '@material-ui/core/styles'
import * as React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-router'
import { store } from '~/store'
import theme from '~/theme/mui'
import 'index.scss'

(function (global) {
    //Useful for adding data and libraries to window object.
})(typeof window !== 'undefined' ? window : {});

addDecorator(withKnobs);
addDecorator(StoryRouter())

addDecorator((story) => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      { story() }
    </MuiThemeProvider>
  </Provider>
))

const components = require.context('../src/components', true, /\.stories\.((js|ts)x?)$/)
const routes = require.context('../src/routes', true, /\.stories\.((js|ts)x?)$/)

function loadStories() {
    components.keys().forEach((filename) => components(filename))
    routes.keys().forEach((filename) => routes(filename))
}

configure(loadStories, module)
