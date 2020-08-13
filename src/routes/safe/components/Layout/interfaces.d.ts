export interface ModalState {
  isOpen: boolean
  title: string | React.ReactElement
  body: React.ReactNode | null
  footer: React.ReactNode | null
  onClose: () => unknown
}

export interface OpenModalArgs {
  title: string | React.ReactElement
  body: React.ReactNode | null
  footer: React.ReactNode | null
  onClose: () => unknown
}
