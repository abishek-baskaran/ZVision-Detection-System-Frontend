/**
 * API utility functions for parameter handling and response management
 */

/**
 * Creates query string from parameters
 */
export function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle array parameters (e.g., types=[system,error])
        value.forEach(item => {
          searchParams.append(key, item.toString())
        })
      } else {
        searchParams.append(key, value.toString())
      }
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Check if mock data should be used for API calls
 * This is controlled by the NEXT_PUBLIC_USE_MOCK_DATA environment variable
 */
export function shouldUseMockData(): boolean {
  // Use mock data if explicitly set to true in environment variables 
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
}

/**
 * Validates a date string format (YYYY-MM-DD)
 */
export function isValidDateString(dateStr: string): boolean {
  if (!dateStr) return false
  
  // Check if it matches YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false
  
  // Check if it's a valid date
  const date = new Date(dateStr)
  const timestamp = date.getTime()
  if (isNaN(timestamp)) return false
  
  return true
}

/**
 * Handles unexpected API response formats by returning a default value or throwing an error
 */
export function handleApiResponse<T>(response: any, validator: (data: any) => boolean, defaultValue?: T): T {
  if (validator(response)) {
    return response as T
  }
  
  if (defaultValue !== undefined) {
    console.warn('Invalid API response format, using default value')
    return defaultValue
  }
  
  throw new Error('Invalid API response format')
} 