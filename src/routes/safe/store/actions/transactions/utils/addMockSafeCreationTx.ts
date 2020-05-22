const addMockSafeCreationTx = (safeAddress: string) => [
  {
    blockNumber: null,
    baseGas: 0,
    confirmations: [],
    data: null,
    executionDate: null,
    gasPrice: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    isExecuted: true,
    nonce: null,
    operation: 0,
    refundReceiver: '0x0000000000000000000000000000000000000000',
    safe: safeAddress,
    safeTxGas: 0,
    safeTxHash: '',
    signatures: null,
    submissionDate: null,
    executor: '',
    to: '',
    transactionHash: null,
    value: 0,
    creationTx: true,
  },
]

export default addMockSafeCreationTx
