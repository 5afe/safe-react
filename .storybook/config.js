import { addDecorator, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import * as React from 'react';
import StoryRouter from 'storybook-router';

(function (global) {
    //Useful for adding data and libraries to window object.
})(typeof window !== 'undefined' ? window : {});

addDecorator(withKnobs);
addDecorator(StoryRouter());

addDecorator((story) => (
    <div>
        { story() }
    </div>
));

const components = require.context('../src/components', true, /\.stories\.((js|ts)x?)$/)
const routes = require.context('../src/routes', true, /\.stories\.((js|ts)x?)$/)

function loadStories() {
    components.keys().forEach((filename) => components(filename));
    routes.keys().forEach((filename) => routes(filename))
}

configure(loadStories, module);
