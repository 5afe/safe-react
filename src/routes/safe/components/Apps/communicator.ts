import { MutableRefObject } from 'react'
import { Methods } from '@gnosis.pm/safe-apps-sdk'

class AppCommunicator {
  private iframe: HTMLIFrameElement
  private handlers = new Map()

  constructor(iframeRef: MutableRefObject<HTMLIFrameElement>) {
    this.iframe = iframeRef.current
  }

  on(method: Methods, handler: () => Promise<unknown> | unknown): void {
    this.handlers.set(method, handler)
  }
}

const useAppCommunicator = (iframeRef: MutableRefObject<HTMLIFrameElement>): AppCommunicator => {
  return new AppCommunicator(iframeRef)
}

export { useAppCommunicator }
