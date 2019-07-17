// @flow
function useTestAccountAt(index: number = 0) {
  window.testAccountIndex = index
}

function resetTestAccount() {
  delete window.testAccountIndex
}

export {
  useTestAccountAt,
  resetTestAccount,
}
