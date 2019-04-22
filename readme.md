# Gnosis Team Safe

Allowing crypto users manage funds in a safer way

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
yarn add truffle // recommended usage of -g flag
yarn add ganache-cli // recommended usage of -g flag
yarn add flow-type // recommended usage of -g flag
git clone https://github.com/gnosis/safe-contracts.git
```

We use [yarn](https://yarnpkg.com) in our infrastacture, so we decided to go with yarn in the README

### Installing

A step by step series of examples that tell you have to get a development env running

Run ganache in one terminal
```
ganache-cli -b 3
```

Start the project in the other one
```
cd safe-contracts && truffle compile && truffle migrate && cd ..
yarn install
yarn start
```

## Running the tests

```
yarn test
```


### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Truffle React Box](https://github.com/truffle-box/react-box) - The web framework used
* [Ganache](https://github.com/trufflesuite/ganache-cli) - Fast Ethereum RPC client
* [React](https://reactjs.org/) - A JS library for building user interfaces
* [Material UI 1.X](https://material-ui-next.com/) - React components that implement Google's Material Design
* [redux, immutable, reselect, final-form](https://redux.js.org/) - React ecosystem libraries
* [Flow](https://flow.org/) - Sttic Type Checker

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/gnosis/gnosis-team-safe/tags). 

## Authors

* **Adolfo Panizo** - [apanizo](https://github.com/apanizo)

See also the list of [contributors](https://github.com/gnosis/gnosis-team-safe/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks for Gnosis Team for providing the Safe contracts.
