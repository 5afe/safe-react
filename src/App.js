import React, { Component } from 'react'
import { Form } from 'react-final-form'
import Safe from '../gnosis-safe-contracts/build/contracts/GnosisSafe.json'
import getWeb3, { promisify } from './utils/getWeb3'
import contract from 'truffle-contract'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
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
    } catch (error) {
      console.log("Error while creating the Safe")
    }
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Gnosis Multisig 2.0</a>
        </nav>
        <main className="container">
          <Form
            onSubmit={this.onCallSafeContractSubmit}
            render={({ handleSubmit, pristine, invalid }) => (
              <form onSubmit={handleSubmit}>
                <h2>Create a new Safe instance for testing purposes</h2>
                <div>
                  <button style={{ marginLeft: '10px', border: '1px solid #ccc' }} type="submit">
                    Submit
                  </button>
                </div> 
              </form>
            )} />
        </main>
      </div>
    );
  }
}

export default App
