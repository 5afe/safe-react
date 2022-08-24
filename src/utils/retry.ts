export function retry(fn: () => Promise<unknown>, retriesLeft = 3, interval = 1000): Promise<any> {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: any) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error)
            return
          } else {
            console.warn('retrying rejected promise', error)
          }
          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject)
        }, interval)
      })
  })
}
