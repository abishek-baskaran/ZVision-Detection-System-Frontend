import axios from 'axios'

// Initialize axios instance with base configuration
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication headers if needed
    // const token = getAuthToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || {})
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status)
    }
    return response
  },
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      // Log or handle specific error codes
      console.error('API Error:', error.response.status, error.response.data)
      
      // Handle specific status codes here if needed
      // switch (error.response.status) {
      //   case 401:
      //     // Handle unauthorized
      //     break
      //   case 404:
      //     // Handle not found
      //     break
      //   default:
      //     break
      // }
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient 