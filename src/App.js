import React, { Component } from 'react'
import { Form, Field } from 'react-final-form'
import Safe from '../gnosis-safe-contracts/build/contracts/GnosisSafe.json'
import getWeb3, { promisify } from './utils/getWeb3'
import contract from 'truffle-contract'
import Header from './components/Header'
import PageFrame from './components/PageFrame'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: undefined,
      safeAddress: undefined,
      funds: undefined,
    }

    this.safe = contract(Safe)
  }

  componentWillMount() {
    getWeb3.then(results => {
      const web3 = results.web3
      this.safe.setProvider(web3.currentProvider)
      this.setState({web3})
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  onCallSafeContractSubmit = async () => {
    try {
      const web3 = this.state.web3
      const accounts = await promisify(cb => web3.eth.getAccounts(cb))
      const safeInstance = await this.safe.new([accounts[0]], 1, 0, 0, { from: accounts[0], gas: '5000000' })
      const transactionHash = safeInstance.transactionHash
      // const transaction = await promisify(cb => web3.eth.getTransaction(transactionHash, cb))
      // console.log("Transaction" + JSON.stringify(transaction, 2, 0))
      const transactionReceipt = await promisify(cb => web3.eth.getTransactionReceipt(transactionHash, cb))
      console.log("Transaction Receipt" + JSON.stringify(transactionReceipt, 2, 0))
      this.setState({ safeAddress: safeInstance.address})
    } catch (error) {
      console.log("Error while creating the Safe")
    }
  }

  onAddFunds = async (values) => {
    const fundsToAdd = values.funds
    try {
      const { web3, safeAddress } = this.state
      const accounts = await promisify(cb => web3.eth.getAccounts(cb))
      const txData = {from: accounts[0], to: safeAddress, value: web3.toWei(fundsToAdd, 'ether')}
      await promisify(cb => web3.eth.sendTransaction(txData, cb))
      const funds = await promisify( cb => web3.eth.getBalance(safeAddress, cb))
      const fundsInEther = funds ? web3.fromWei(funds.toNumber(), 'ether') : 0
      this.setState({funds: fundsInEther})
    } catch (error) {
      console.log("Errog adding funds to safe" + error)
    }
  }

  render() {
    const { safeAddress, funds } = this.state

    return (
      <div className="App">
        <Header />
        <PageFrame>
          <Form
            onSubmit={this.onCallSafeContractSubmit}
            render={({ handleSubmit, pristine, invalid }) => (
              <form onSubmit={handleSubmit}>
                <h2>Create a new Safe instance for testing purposes</h2>
                <div>
                  <button style={{ marginLeft: '10px', border: '1px solid #ccc' }} type="submit">
                    Create Safe
                  </button>
                </div> 
              </form>
            )} />
            <Form
              onSubmit={this.onAddFunds}
              render={({ handleSubmit, pristine, invalid }) => (
                <form onSubmit={handleSubmit}>
                  <h2>Add Funds to the safe</h2>
                  <div style={{ margin: '10px 0px'}}>
                    <label style={{ marginRight: '10px' }}>{safeAddress ? safeAddress : 'Not safe detected'}</label>
                  </div>
                  { safeAddress && <div>
                    <Field name="funds" component="input" placeholder="ETH to add" />
                    <button style={{ marginLeft: '10px', border: '1px solid #ccc' }} type="submit" disabled={ !safeAddress || pristine || invalid}>
                      Add funds
                    </button>
                  </div> }
                  { safeAddress && <div style={{ margin: '10px 0px'}}>
                    Total funds in this safe: { funds ? funds : 0 } ETH
                  </div> }
                </form>
              )}
            />
          </PageFrame>
      </div>
    );
  }
}

export default App
