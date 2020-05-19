// 
function useTestAccountAt(index = 0) {
  (window as any).testAccountIndex = index
}

function resetTestAccount() {
  delete (window as any).testAccountIndex
}

export { useTestAccountAt, resetTestAccount }
