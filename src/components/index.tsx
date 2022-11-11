import styled from 'styled-components'
import bgNoise from '../assets/bg-noise.gif'

export const StaticOverlay = styled.div`
  -webkit-font-smoothing: antialiased;
  background-attachment: fixed;
  background-repeat: repeat;
  bottom: 0;
  display: block;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  background-image: url(${bgNoise});
  background-size: 170px;
  mix-blend-mode: lighten;
  opacity: 70%;
  z-index: 600;
`

export const ThemedBackgroundMovingLines = styled.div`
  -webkit-font-smoothing: antialiased;
  background-image: url(data:image/gif;base64,R0lGODlhCgAgAIABAAAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmIwZjhiZTkwLCAyMDIxLzEyLzE1LTIxOjI1OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNUFBNUE4NDg5NDgxMUVDQjAwRDg1RkQyNUExRUU3RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNUFBNUE4NTg5NDgxMUVDQjAwRDg1RkQyNUExRUU3RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY1QUE1QTgyODk0ODExRUNCMDBEODVGRDI1QTFFRTdEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY1QUE1QTgzODk0ODExRUNCMDBEODVGRDI1QTFFRTdEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkECQoAAQAsAAAAAAoAIAAAAhWEj5nB7Q+jnLTai7N2qvcNhuJIlgUAIfkECQoAAQAsAAAAAAoAIAAAAhaEj6HL7Q+jnLTaixnafOcPhuJIdkcBACH5BAkKAAEALAAAAAAKACAAAAIVjI+py+0Po5wUgYuz1rX7D4biRpIFACH5BAkKAAEALAAAAAAKACAAAAIWjI+py+0Po5wO2Itzprz7D4aLRpJOAQAh+QQJCgABACwAAAAACgAgAAACFYyPqcvtD6OcoNqL8dy8+w9K2Th+BQAh+QQJCgABACwAAAAACgAgAAACFoyPqcvtD6NMoNqL8dy8+w9K2TiGTAEAIfkECQoAAQAsAAAAAAoAIAAAAhWMj6nL7Q9jA7Tae6XevPsPYqIIegUAIfkECQoAAQAsAAAAAAoAIAAAAhaMj6nL7Q8hmLRaG7PevPvPXKIIlksBACH5BAkKAAEALAAAAAAKACAAAAIWjI+py+0PDZi0Whuz3rz7z1yiCJZcAQAh+QQJCgABACwAAAAACgAgAAACFoyPqcvtj4CctFaIs968+22F4UeWSwEAIfkECQoAAQAsAAAAAAoAIAAAAhaMj6nL7QminJS+i7PevHtYhdVHllwBACH5BAkKAAEALAAAAAAKACAAAAIWjI+py50Ao5zT2Yuz3rxnCoLeSJZMAQAh+QQJCgABACwAAAAACgAgAAACFoyPqcsID6OUrdqLs968pwmC3kiWXQEAIfkECQoAAQAsAAAAAAoAIAAAAhaMj6lr4A9jZLTai7PeXMv/deJIllUBACH5BAkKAAEALAAAAAAKACAAAAIWjI+ZwO3/lJy02ouz3tzA/3XiSJZjAQAh+QQFCgABACwAAAAACgAgAAACFoyPoMvdCKOctNqLs97Vec+F4kiWWAEAOw==);
  opacity: 10%;
  z-index: 9899;
  background-attachment: fixed;
  background-repeat: repeat;
  bottom: 0;
  display: block;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
`
