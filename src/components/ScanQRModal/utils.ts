//
navigator.getMedia =
  navigator.getUserMedia || // use the proper vendor prefix
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

export const checkWebcam = (success, err) =>
  navigator.getMedia(
    { video: true },
    () => {
      success()
    },
    () => {
      err()
    },
  )
