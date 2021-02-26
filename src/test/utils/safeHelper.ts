//@ts-nocheck
import { NonPayableTransactionObject } from 'src/types/contracts/types.d'
import { PromiEvent } from 'web3-core'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { ContractOptions, ContractSendMethod, DeployOptions, EventData, PastEventOptions } from 'web3-eth-contract'
import {
  ConfirmationServiceModel,
  TxServiceModel,
} from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { DataDecoded } from 'src/routes/safe/store/models/types/transactions.d'
import { List, Map } from 'immutable'
import { PendingActionValues } from 'src/logic/safe/store/models/types/transaction'

const mockNonPayableTransactionObject = (callResult?: string): NonPayableTransactionObject<string | void | boolean | string[]> => {
  return {
    arguments: [],
    call: (tx?) => new Promise((resolve) => resolve(callResult || '')),
    encodeABI: (tx?) => '',
    estimateGas: (tx?) => new Promise((resolve) => resolve(1000)),
    send: () => { return {} as PromiEvent<any>}
  }
}

type SafeMethodsProps = {
  threshold?: string
  nonce?: string
  isOwnerUserAddress?: string,
  name?: string,
  version?: string
}

export const getMockedSafeInstance = (safeProps: SafeMethodsProps): GnosisSafe => {
  const { threshold = '1', nonce = '0', isOwnerUserAddress, name = 'safeName', version = '1.0.0' } = safeProps
  return {
    defaultAccount: undefined,
    defaultBlock: undefined,
    defaultChain: undefined,
    defaultCommon: undefined,
    defaultHardfork: undefined,
    handleRevert: false,
    options: undefined,
    transactionBlockTimeout: 0,
    transactionConfirmationBlocks: 0,
    transactionPollingTimeout: 0,
    clone(): GnosisSafe {
      return undefined;
    },
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): GnosisSafe {
      return undefined;
    },
    deploy(options: DeployOptions): ContractSendMethod {
      return undefined;
    },
    getPastEvents(event: string, options?: PastEventOptions | ((error: Error, event: EventData) => void), callback?: (error: Error, event: EventData) => void): Promise<EventData[]> {
      return undefined;
    },
    once(event: "AddedOwner" | "ExecutionFromModuleSuccess" | "EnabledModule" | "ChangedMasterCopy" | "ExecutionFromModuleFailure" | "RemovedOwner" | "ApproveHash" | "DisabledModule" | "SignMsg" | "ExecutionSuccess" | "ChangedThreshold" | "ExecutionFailure", cb: any): void {
    },
    events: { } as any,
    methods: {
      NAME: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject(name) as NonPayableTransactionObject<string>,
      VERSION: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject(version) as NonPayableTransactionObject<string>,
      addOwnerWithThreshold: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      approvedHashes: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
      changeMasterCopy: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      changeThreshold: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      disableModule: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      domainSeparator: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
      enableModule: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      execTransactionFromModule: (): NonPayableTransactionObject<boolean> => mockNonPayableTransactionObject() as NonPayableTransactionObject<boolean>,
      execTransactionFromModuleReturnData: (): NonPayableTransactionObject<any> => mockNonPayableTransactionObject() as NonPayableTransactionObject<any>,
      getModules: (): NonPayableTransactionObject<string[]> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string[]>,
      getThreshold: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject(threshold) as NonPayableTransactionObject<string>,
      isOwner: (): NonPayableTransactionObject<boolean> => mockNonPayableTransactionObject(isOwnerUserAddress) as NonPayableTransactionObject<boolean>,
      nonce: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject(nonce) as NonPayableTransactionObject<string>,
      removeOwner: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      setFallbackHandler: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      signedMessages: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
      swapOwner: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      setup: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      execTransaction: (): NonPayableTransactionObject<boolean> => mockNonPayableTransactionObject() as NonPayableTransactionObject<boolean>,
      requiredTxGas: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
      approveHash: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      signMessage: (): NonPayableTransactionObject<void> => mockNonPayableTransactionObject() as NonPayableTransactionObject<void>,
      isValidSignature: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
      getMessageHash: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
      encodeTransactionData: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
      getTransactionHash: (): NonPayableTransactionObject<string> => mockNonPayableTransactionObject() as NonPayableTransactionObject<string>,
    } as any
  }
}

type TransactionProps = {
  baseGas?: number
  blockNumber?: number | null
  confirmations?: ConfirmationServiceModel[]
  confirmationsRequired?: number
  creationTx?: boolean | null
  data?: string | null
  dataDecoded?: DataDecoded
  ethGasPrice?: string
  executionDate?: string | null
  executor?: string
  fee?: string
  gasPrice?: string
  gasToken?: string
  gasUsed?: number
  isExecuted?: boolean
  isSuccessful?: boolean
  modified?: string
  nonce?: number | null
  operation?: number
  origin?: string | null
  ownersWithPendingActions?: Map<PendingActionValues, List<any>>,
  recipient?: string,
  refundParams?: string,
  refundReceiver?: string
  safe?: string
  safeTxGas?: number
  safeTxHash?: string
  signatures?: string
  submissionDate?: string | null
  to?: string
  transactionHash?: string | null
  value?: string
}


export const getMockedTxServiceModel = (txProps: TransactionProps): TxServiceModel => {
  return {
    baseGas: 0,
    confirmations: [],
    confirmationsRequired: 0,
    creationTx: false,
    data: null,
    ethGasPrice: '',
    executionDate: '',
    executor: '',
    fee: '',
    gasPrice: '',
    gasToken: '',
    gasUsed: 0,
    isExecuted: false,
    isSuccessful: false,
    modified: '',
    nonce: 0,
    operation: 0,
    origin: '',
    ownersWithPendingActions: Map(),
    recipient: '',
    refundParams: '',
    refundReceiver: '',
    safe: '',
    safeTxGas: 0,
    safeTxHash: '',
    signatures: '',
    submissionDate: '',
    to: '',
    transactionHash: '',
    value: '',
    ...txProps
  }
}
