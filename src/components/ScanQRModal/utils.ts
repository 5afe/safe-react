export const checkWebcam = async (): Promise<boolean> => {
  if (!navigator.mediaDevices?.getUserMedia) {
    return false
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach((track) => track.stop())
    return true
  } catch (err) {
    return false
  }
}
