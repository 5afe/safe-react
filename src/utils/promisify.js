// @flow
export const promisify = (inner: Function): Promise<any> =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    }))
