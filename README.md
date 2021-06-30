# Gnosis Safe

The most trusted platform to store digital assets on Ethereum. More info at [gnosis-safe.io](https://gnosis-safe.io/)

This repository contains the code for the frontend code hosted at [https://gnosis-safe.io/app/]

Besides the Ethereum Mainnet, the following networks are supported:

- [Rinkeby Testnet](https://rinkeby.gnosis-safe.io/app/)
- [xDai](https://xdai.gnosis-safe.io/app/)
- [Energy Web Chain](https://ewc.gnosis-safe.io/app/)
- [Volta Testnet](https://volta.gnosis-safe.io/app/)

For technical information please refer to the [Gnosis Developer Portal](https://docs.gnosis.io/safe/).

For support requests, please open up a [bug issue](https://github.com/gnosis/safe-react/issues/new?template=bug-report.md) or reach out via [Discord](https://discordapp.com/invite/FPMRAwK).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [Deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

We use [yarn](https://yarnpkg.com) in our infrastructure, so we decided to go with yarn in the README.
Please install yarn globally if you haven't already.

### Environment variables
The app grabs environment variables from the `.env` file. Copy our template to your own local file:
```
cp .env.example .env
```

To execute transactions, you'll need to create an [Infura](https://infura.io) project and set the project ID in the `.env` you've just created:
```
REACT_APP_INFURA_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
Once done, you'll need to restart the app if it's already running.

### Installing and running

Install dependencies for the project:
```
yarn install
```

To use the Rinkeby services:
```
yarn start
```

If you prefer using the Mainnet ones:
```
yarn start-mainnet
```

### Building
For Rinkeby:
```
yarn build
```

For Mainnet:
```
yarn build-mainnet
```

## Running the tests

To run the tests:
```
yarn test
```

### Lint

ESLint will be run automatically before you commit. To run it manually:

```
yarn lint:fix
```

## Deployment

### Dev & staging
The code is deployed to a testing website automatically on each push via a GitHub Action.
The GitHub Action will create a new subdomain and post the link as a comment in the PR.

When pushing to the `main` branch, the code will be automatically deployed to [staging](https://safe-team-rinkeby.staging.gnosisdev.com/).

### Production
Deployment to production is done manually. Please see the [release procedure](docs/release-procedure.md) notes for details.

## Configuring the app for running on different networks

[Please check the network configuration documentation](./docs/networks.md)

## Built With

* [React](https://reactjs.org/) - A JS library for building user interfaces
* [Material UI 4.X](https://material-ui.com/) - React components that implement Google's Material Design
* [redux, immutable, reselect, final-form](https://redux.js.org/) - React ecosystem libraries

![app diagram](https://user-images.githubusercontent.com/381895/121764528-e5e2e900-cb44-11eb-8643-483d41040349.png)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/gnosis/gnosis-team-safe/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
