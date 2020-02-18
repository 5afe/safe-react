// @flow
export const sleep: Function = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
