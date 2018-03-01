import React, { Component } from 'react'
import { Form, Field } from 'react-final-form'
import Safe from '../gnosis-safe-contracts/build/contracts/GnosisSafe.json'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
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
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      //this.instantiateContract()
      this.createSafe()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  createSafe() {
    this.safe.setProvider(this.state.web3.currentProvider)

    /*let safeInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      safe.deployed().then((instance) => {
        safeInstance = instance
        debugger
        // Stores a given value, 5 by default.
        //return simpleStorageInstance.set(5, {from: accounts[0]})
      })/*.then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })*/
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    //const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  onCallSafeContractSubmit = () => {

    this.state.web3.eth.getAccounts((error, accounts) => {
      debugger
      this.safe.new([accounts[0]], 1, 0, 0, { from: accounts[0], gas: '5000000' })
        .then( async (instance) => {
          console.log("transactionHash -> " + instance.transactionHash)
          console.log("adress -> " + instance.address)
          this.state.web3.eth.getTransaction(instance.transactionHash, (err, result) => {
            console.log(result);
          })
          console.log("")
        });
    })
  }

  onCreateBoxSubmit = async values => {
    await this.sleep(300)
    window.alert("Creating a new box " + JSON.stringify(values, 2, 0));
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>
        <main className="container">
          <Form
            onSubmit={this.onCallSafeContractSubmit}
            render={({ handleSubmit, pristine, invalid }) => (
              <form onSubmit={handleSubmit}>
                <h2>Create a new instance for testing purposes</h2>
                <div>
                  <button style={{ marginLeft: '10px', border: '1px solid #ccc' }} type="submit">
                    Submit
                  </button>
                </div> 
              </form>
            )} />
          <Form
            onSubmit={this.onCreateBoxSubmit}
            render={({ handleSubmit, pristine, invalid }) => (
              <form onSubmit={handleSubmit}>
                <h2>Create your instance of a Safe Box</h2>
                <div>
                  <label style={ { marginRight: '10px' }}>Owner Address</label>
                  <Field name="owner" component="input" placeholder="Safe owner address" />
                  <button style={{ marginLeft: '10px', border: '1px solid #ccc' }} type="submit" disabled={pristine || invalid}>
                    Submit
                  </button>
                </div> 
              </form>
            )} />
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
