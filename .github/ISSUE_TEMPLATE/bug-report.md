name: Bug Report
description: File a bug report
title: "[Bug]: "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  - type: textarea
    id: Bug description
    attributes:
      label: Bug description
      description: A short description of the bug
      placeholder: Tell us what you see!
      value: "A bug happened!"
    validations:
      required: true
  - type: textarea
    id: Steps
    attributes:
      label: Steps to reproduce
      description: Help us reproduce the issue
      placeholder: "* Go to ..."
      value: "* Go to..."
    validations:
      required: true
  - type: dropdown
    id: browser
    attributes:
      label: What browser are you seeing the problem on?
      value: Chrome
      options:
        - Chrome
        - Firefox
        - Safari
  - type: dropdown
    id: wallet
    attributes:
      label: Ethereum wallet
      value: MetaMask
      options:
        - MetaMask
        - WalletConnect
        - Ledger
        - Trezor
        - Other
  - type: dropdown
    id: network
    attributes:
      label: What chain is it happening on?
      value: Rinkeby
      options:
        - Mainnet
        - Rinkeby
        - Goerli
        - Polygon
        - BSC
        - Gnosis Chain
        - Arbitrum
        - Avalanche
        - Optimism
        - Aurora
        - EWC/Volta
  - type: textarea
    id: logs
    attributes:
      label: Errors in the console?
      description: Please copy and paste any relevant log output. This will be automatically formatted into code, so no need for backticks.
      render: shell
