# Boba Multisig

![license](https://img.shields.io/github/license/gnosis/safe-react)
![build](https://img.shields.io/github/workflow/status/gnosis/safe-react/Deploy%20to%20Mainnet%20network/main)
![tests](https://img.shields.io/github/workflow/status/gnosis/safe-react/Unit%20tests%20&%20coverage/main?label=tests)
![coverage](https://coveralls.io/repos/github/gnosis/safe-react/badge.svg?branch=main)
![release](https://img.shields.io/github/v/release/gnosis/safe-react)

The most trusted platform to store digital assets on Ethereum. More info at [gnosis-safe.io](https://gnosis-safe.io/)

For technical information please refer to the [Gnosis Developer Portal](https://docs.gnosis.io/safe/).

For support requests, please open up a [bug issue](https://github.com/gnosis/safe-react/issues/new?template=bug-report.md) or reach out via [Discord](https://chat.gnosis-safe.io).

## Transactions

Please see the [transaction](docs/transactions.md) notes for more information about transaction details.

## Related repos

- [safe-react-e2e-tests](https://github.com/gnosis/safe-react-e2e-tests)
- [safe-react-gateway-sdk](https://github.com/gnosis/safe-react-gateway-sdk)
- [safe-react-components](https://github.com/gnosis/safe-react-components)

## Deployed environments

- Production: https://gnosis-safe.io/app/
- Staging: https://safe-team.staging.gnosisdev.com/app/
- Dev: https://safe-team.dev.gnosisdev.com/app/
- PRs: `https://pr<PR_NUMBER>--safereact.review-safe.gnosisdev.com/app/`

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes. See [Deployment](#deployment) for notes on how to deploy the project on a live system.

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

To launch the dev version of the app locally:

```
yarn start
```

Alternatively, to run the production version of the app:

```
yarn build
mv build app
python -m SimpleHTTPServer 3000
```

And open http://localhost:3000/app in the browser.

### Docker

If you prefer to use Docker:

```
docker-compose build && docker-compose up
```

### Building

To get a complete bundle using the current configuration use:

```
yarn build
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

When pushing to the `main` branch, the code will be automatically deployed to [staging](https://safe-team.staging.gnosisdev.com/).

### Production

Deployment to production is done manually. Please see the [release procedure](docs/release-procedure.md) notes for details.

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
