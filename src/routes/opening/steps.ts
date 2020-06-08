import { ContinueFooter, GenericFooter } from './components/Footer'

export const isConfirmationStep = (stepIndex?: number) => stepIndex === 0

export const steps = [
  {
    id: '1',
    label: 'Waiting for transaction confirmation',
    description: undefined,
    instruction: 'Please confirm the Safe creation in your wallet',
    footerComponent: null,
  },
  {
    id: '2',
    label: 'Transaction submitted',
    description: undefined,
    instruction: 'Please do not leave the page',
    footerComponent: GenericFooter,
  },
  {
    id: '3',
    label: 'Validating transaction',
    description: undefined,
    instruction: 'Please do not leave the page',
    footerComponent: GenericFooter,
  },
  {
    id: '4',
    label: 'Deploying smart contract',
    description: undefined,
    instruction: 'Please do not leave the page',
    footerComponent: GenericFooter,
  },
  {
    id: '5',
    label: 'Generating your Safe',
    description: undefined,
    instruction: 'Please do not leave the page',
    footerComponent: GenericFooter,
  },
  {
    id: '6',
    label: 'Success',
    description: 'Your Safe was created successfully',
    instruction: 'Click below to get started',
    footerComponent: ContinueFooter,
  },
]
