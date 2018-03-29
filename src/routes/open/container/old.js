// @flow

/*
onAddFunds = async (values: Object) => {
    const { fundsToAdd } = values
    const { safeAddress } = this.state
    try {
      const web3 = getWeb3()
      const accounts = await promisify(cb => web3.eth.getAccounts(cb))
      const txData = { from: accounts[0], to: safeAddress, value: web3.toWei(fundsToAdd, 'ether') }
      await promisify(cb => web3.eth.sendTransaction(txData, cb))
      const funds = await promisify(cb => web3.eth.getBalance(safeAddress, cb))
      const fundsInEther = funds ? web3.fromWei(funds.toNumber(), 'ether') : 0
      this.setState({ funds: fundsInEther })
    } catch (error) {
      // eslint-disable-next-line
      console.log(`Errog adding funds to safe${error}`)
    }
  }


<GnoForm onSubmit={onAddFunds} width="500">
      {(pristine, invalid) => (
        <Block margin="md">
          <Heading tag="h2" margin="lg">Add Funds to the safe</Heading>
          <div style={{ margin: '10px 0px' }}>
            <label style={{ marginRight: '10px' }}>{safeAddress || 'Not safe detected'}</label>
          </div>
          { safeAddress &&
            <div>
              <Field name="fundsToAdd" component={TextField} type="text" placeholder="ETH to add" />
              <Button type="submit" disabled={!safeAddress || pristine || invalid}>
                Add funds
              </Button>
            </div>
          }
          { safeAddress &&
            <div style={{ margin: '15px 0px' }}>
              Total funds in this safe: { funds || 0 } ETH
            </div>
          }
        </Block>
      )}
    </GnoForm>
*/
