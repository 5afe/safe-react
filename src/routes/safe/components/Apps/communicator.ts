import { MutableRefObject } from 'react'

class AppCommunicator {
  private iframe: HTMLIFrameElement

  constructor(iframeRef: MutableRefObject<HTMLIFrameElement>) {
    this.iframe = iframeRef.current
  }
}

const useAppCommunicator = (iframeRef: MutableRefObject<HTMLIFrameElement>): AppCommunicator => {
  return new AppCommunicator(iframeRef)
}

export { useAppCommunicator }
