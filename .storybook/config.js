import 'babel-polyfill'
import { addDecorator, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { MuiThemeProvider } from 'material-ui/styles'
import * as React from 'react'
import StoryRouter from 'storybook-router'
import theme from '~/theme/mui'
import 'index.scss'

(function (global) {
    //Useful for adding data and libraries to window object.
})(typeof window !== 'undefined' ? window : {});

addDecorator(withKnobs);
addDecorator(StoryRouter())

// Adding Material UI Theme
addDecorator(story => (
  <MuiThemeProvider theme={theme}>
    { story() }
  </MuiThemeProvider>
))

/*
  https://storybook.js.org/addons/introduction/
  addDecorator((story) => (
    <div>
        { story() }
    </div>
  ));
*/

const components = require.context('../src/components', true, /\.stories\.((js|ts)x?)$/)
const routes = require.context('../src/routes', true, /\.stories\.((js|ts)x?)$/)

function loadStories() {
    components.keys().forEach((filename) => components(filename))
    routes.keys().forEach((filename) => routes(filename))
}

configure(loadStories, module);
