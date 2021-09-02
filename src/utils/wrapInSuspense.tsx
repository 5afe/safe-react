import React, { SuspenseProps } from 'react'

export const wrapInSuspense = (
  component: Required<SuspenseProps['children']>,
  fallback: SuspenseProps['fallback'] = null,
) => <React.Suspense fallback={fallback}>{component}</React.Suspense>
