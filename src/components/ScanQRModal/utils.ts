const navigatorCp: any = navigator

navigatorCp.getMedia =
  navigatorCp.getUserMedia || // use the proper vendor prefix
  navigatorCp.webkitGetUserMedia ||
  navigatorCp.mozGetUserMedia ||
  navigatorCp.msGetUserMedia

export const checkWebcam = (success, err) =>
  navigatorCp.getMedia(
    { video: true },
    () => {
      success()
    },
    () => {
      err()
    },
  )
