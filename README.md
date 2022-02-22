# Celo Safe

A fork of the most trusted platform to store digital assets on Ethereum. More info at [gnosis-safe.io](https://gnosis-safe.io/)

For technical information please refer to the [Gnosis Developer Portal](https://docs.gnosis.io/safe/).

For support requests, please open up a [bug issue](https://github.com/celo-org/safe-react/issues/new?template=bug-report.md)

## Production deployments

This repository contains the code for the frontend code hosted at https://safe.celo.org

Besides the Celo Mainnet, the following networks are supported:

- [Alfajores Testnet](https://safe.celo.org)
- [Baklava Testnet](https://safe.celo.org)


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

### Installing and running

Install dependencies for the project:

```
yarn install
```

To use the Alfajores services:

```
yarn start
```

If you prefer using the Mainnet ones:

```
yarn start-mainnet
```

If you prefer to use Docker:

```
docker-compose build && docker-compose up
```

### Building

For Alfajores:

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

When pushing to the `main` branch, the code will be automatically deployed to [staging](https://safe-react-beta.vercel.app).

### Production

Deployment to production is done manually. Please see the [release procedure](docs/release-procedure.md) notes for details.

## Configuring the app for running on different networks

[Please check the network configuration documentation](./docs/networks.md)

## Built With

- [React](https://reactjs.org/) - A JS library for building user interfaces
- [Material UI 4.X](https://material-ui.com/) - React components that implement Google's Material Design
- [redux, immutable, reselect, final-form](https://redux.js.org/) - React ecosystem libraries

![app diagram](https://user-images.githubusercontent.com/381895/129330828-c067425b-d20b-4f67-82c7-c0598deb453a.png)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/gnosis/gnosis-team-safe/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
