const navigatorCp: any = navigator

navigatorCp.getMedia =
  navigatorCp.getUserMedia || // use the proper vendor prefix
  navigatorCp.webkitGetUserMedia ||
  navigatorCp.mozGetUserMedia ||
  navigatorCp.msGetUserMedia

export const checkWebcam = (): Promise<boolean> => {
  return new Promise((resolve) => {
    navigatorCp.getMedia(
      { video: true },
      (stream: MediaStream) => {
        stream.getTracks().forEach((track) => track.stop())
        resolve(true)
      },
      () => {
        resolve(false)
      },
    )
  })
}
