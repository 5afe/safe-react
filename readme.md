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

What you need to install globally:

```
yarn global add truffle ganache-cli
```

We use [yarn](https://yarnpkg.com) in our infrastructure, so we decided to go with yarn in the README

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

### Environment variables
The app grabs environment variables from the `.env` file. Copy our template to your own local file:
```
cp .env.example .env
```

To execute transactions, you'll need to create an [Infura](https://infura.io) project and set the project ID in the `.env` you've just created:
```
REACT_APP_INFURA_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
Once done, you'll need to restart the app.

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

1. Run `transaction-history-service`
```
git clone https://github.com/gnosis/safe-transaction-service.git
cd safe-transaction-service
git checkout develop
docker-compose build
# it comes enabled by default in docker-compose
sudo service postgresql stop
docker-compose up -d
```
Check that the service is running at https://localhost:8000

2. Migrate Safe Contracts:
```
git clone https://github.com/gnosis/safe-contracts.git
cd safe-contracts
yarn
npx truffle migrate
```
3. Migrate Token Contracts for the tests:
Inside `safe-react` directory
```
npx truffle migrate
```
4. Run the tests:
```
yarn test
```

### Lint

ESLint will be run automatically before you commit. To run it manually:


```
yarn lint:fix
```

## Deployment

The code is deployed to a testing website automatically on each push via a GitHub Action.
The GitHub Action will create a new subdomain and post the link as a comment in the PR.

When pushing to the `master` branch, the code will be uploaded to the production bucket but not deployed automatically.
This is done manually by the devops team for extra safety.

## Releasing to production

We prepare a new release every sprint. Sprints are two weeks long.

* A separate code-freeze branch named `release/X.Y.Z` is created
* The QA team do regression testing on this branch
* If issues are found, bugfixes are merged into this branch
* Once the QA is done, we push the branch to `master` (which is deployed to production)
* Master is afterwards backmerged into the main `development` branch.

## Configuring the app for running on different networks

[Please check the network configuration documentation](./docs/networks.md)

## Built With

* [Truffle React Box](https://github.com/truffle-box/react-box) - The web framework used
* [Ganache](https://github.com/trufflesuite/ganache-cli) - Fast Ethereum RPC client
* [React](https://reactjs.org/) - A JS library for building user interfaces
* [Material UI 4.X](https://material-ui.com/) - React components that implement Google's Material Design
* [redux, immutable, reselect, final-form](https://redux.js.org/) - React ecosystem libraries

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/gnosis/gnosis-team-safe/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
