/**
 * Validates a link submission by checking if it's a valid URL and accessible
 * @param link The URL to validate
 * @returns Promise<boolean> True if the link is valid and accessible
 */
export async function validateLinkSubmission(link: string): Promise<boolean> {
  try {
    // First check if it's a valid URL
    const url = new URL(link)
    
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }

    // Try to fetch the URL to check if it's accessible
    const response = await fetch(link, {
      method: 'HEAD',  // Only fetch headers to be efficient
      headers: {
        'User-Agent': 'AdvocacyHub-Validator/1.0'
      }
    })

    // Consider any 2xx status code as valid
    return response.ok
  } catch (error) {
    // URL constructor will throw for invalid URLs
    // fetch will throw for network errors
    console.error('Link validation error:', error)
    return false
  }
}

/**
 * Validates a text submission by checking length and content
 * @param text The text content to validate
 * @param minLength Minimum required length (default: 50)
 * @param maxLength Maximum allowed length (default: 5000)
 * @returns boolean True if the text meets the requirements
 */
export function validateTextSubmission(
  text: string,
  minLength: number = 50,
  maxLength: number = 5000
): boolean {
  if (!text || typeof text !== 'string') {
    return false
  }

  const cleanText = text.trim()
  
  // Check length requirements
  if (cleanText.length < minLength || cleanText.length > maxLength) {
    return false
  }

  // Could add more validation here like:
  // - Checking for minimum word count
  // - Checking for spam patterns
  // - Checking for required keywords
  
  return true
}

/**
 * Validates an image submission
 * @param imageUrl URL of the uploaded image
 * @param mimeTypes Allowed MIME types (default: common image formats)
 * @param maxSizeBytes Maximum file size in bytes (default: 5MB)
 * @returns Promise<boolean> True if the image meets the requirements
 */
export async function validateImageSubmission(
  imageUrl: string,
  mimeTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'],
  maxSizeBytes: number = 5 * 1024 * 1024
): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    
    if (!response.ok) {
      return false
    }

    // Check content type
    const contentType = response.headers.get('content-type')
    if (!contentType || !mimeTypes.includes(contentType.toLowerCase())) {
      return false
    }

    // Check file size
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > maxSizeBytes) {
      return false
    }

    return true
  } catch (error) {
    console.error('Image validation error:', error)
    return false
  }
}
