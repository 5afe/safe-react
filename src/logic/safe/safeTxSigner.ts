import { List } from 'immutable'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import semverSatisfies from 'semver/functions/satisfies'
import { SAFE_VERSION_FOR_OFF_CHAIN_SIGNATURES } from './transactions/offchainSigner'

// Here we're checking that safe contract version is greater or equal 1.1.1, but
// theoretically EIP712 should also work for 1.0.0 contracts
// Also, offchain signatures are not working for ledger/trezor wallet because of a bug in their library:
// https://github.com/LedgerHQ/ledgerjs/issues/378
// Couldn't find an issue for trezor but the error is almost the same
export const checkIfOffChainSignatureIsPossible = (
  isExecution: boolean,
  isSmartContractWallet: boolean,
  safeVersion?: string,
): boolean =>
  !isExecution &&
  !isSmartContractWallet &&
  !!safeVersion &&
  semverSatisfies(safeVersion, SAFE_VERSION_FOR_OFF_CHAIN_SIGNATURES)

// https://docs.gnosis.io/safe/docs/contracts_signatures/#pre-validated-signatures
export const getPreValidatedSignatures = (from: string, initialString: string = EMPTY_DATA): string => {
  return `${initialString}000000000000000000000000${from.replace(
    EMPTY_DATA,
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`
}

export const generateSignaturesFromTxConfirmations = (
  confirmations?: List<Confirmation>,
  preApprovingOwner?: string,
): string => {
  let confirmationsMap =
    confirmations?.map((value) => {
      return {
        signature: value.signature,
        owner: value.owner.toLowerCase(),
      }
    }) || List([])

  if (preApprovingOwner) {
    confirmationsMap = confirmationsMap.push({ owner: preApprovingOwner, signature: null })
  }

  // The constant parts need to be sorted so that the recovered signers are sorted ascending
  // (natural order) by address (not checksummed).
  confirmationsMap = confirmationsMap.sort((ownerA, ownerB) => ownerA.owner.localeCompare(ownerB.owner))

  let sigs = '0x'
  confirmationsMap.forEach(({ signature, owner }) => {
    if (signature) {
      sigs += signature.slice(2)
    } else {
      // https://docs.gnosis.io/safe/docs/contracts_signatures/#pre-validated-signatures
      sigs += getPreValidatedSignatures(owner, '')
    }
  })

  return sigs
}
