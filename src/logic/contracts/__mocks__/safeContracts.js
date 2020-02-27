// @flow
export const getGnosisSafeInstanceAt = () => Promise.resolve({ nonce: () => Promise.resolve({ toString: () => '45' }) })
