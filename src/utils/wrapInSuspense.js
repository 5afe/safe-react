// @flow
import React from 'react'
export const wrapInSuspense = (component, fallback) => <React.Suspense fallback={fallback}>{component}</React.Suspense>
