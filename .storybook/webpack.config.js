
process.env.NODE_ENV = 'development'
const prodConfig = require('../config/webpack.config.dev');

module.exports = function(storybookConfig, configType) {

    const config = Object.assign({}, prodConfig);

    storybookConfig.module.rules = storybookConfig.module.rules.concat(config.module.rules)
    storybookConfig.resolve = config.resolve;

    return storybookConfig;
};
