// @flow
navigator.getMedia = navigator.getUserMedia // use the proper vendor prefix
  || navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia
  || navigator.msGetUserMedia

export const checkWebcam = (success: Function, err: Function) => navigator.getMedia(
  { video: true },
  () => {
    success()
  },
  () => {
    err()
  },
)
