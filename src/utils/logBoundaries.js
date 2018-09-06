// @flow
export type Info = {
  componentStack: string,
}

export const logComponentStack = (error: Error, info: Info) => {
  // eslint-disable-next-line
  console.log(error)
  // eslint-disable-next-line
  console.log(info.componentStack)
}

