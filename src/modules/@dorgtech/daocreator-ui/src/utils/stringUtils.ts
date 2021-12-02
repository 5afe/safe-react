export function truncateString(
  str: string,
  firstCharCount = str.length,
  endCharCount = 0,
  dotCount = 3
) {
  let convertedStr = "";
  convertedStr += str.substring(0, firstCharCount);
  convertedStr += ".".repeat(dotCount);
  convertedStr += str.substring(str.length - endCharCount, str.length);
  return convertedStr;
}
