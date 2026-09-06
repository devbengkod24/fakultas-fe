export function extractFileNameFromUrl(url: string): string {
  try {
    const fullFileName = url.split('/').pop() || url
    const decodedFileName = decodeURIComponent(fullFileName)
    const match = decodedFileName.match(/^\d+_[a-f0-9]+_(.+)$/i)
    
    if (match && match[1]) {
      return match[1]
    }
    return decodedFileName
  } catch {
    return url
  }
}

export function truncateFileNameMiddle(fileName: string, maxLength: number = 20): string {
  if (fileName.length <= maxLength) return fileName
  const lastDotIndex = fileName.lastIndexOf('.')
  const name = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : ''
  const availableLength = maxLength - 3 - extension.length
  
  if (availableLength <= 0) return fileName
  
  const startLength = Math.ceil(availableLength / 2)
  const endLength = Math.floor(availableLength / 2)
  
  const start = name.substring(0, startLength)
  const end = name.substring(name.length - endLength)
  
  return `${start}...${end}${extension}`
}


export const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const formatTimeString = (time: string | null | undefined): string => {
  if (!time) return "-"
  return time.substring(0, 5).replace(":", ".")
}