# API Client Design

This document outlines the design for a centralized API client to handle communication between the ZVision frontend and backend.

## Overview

To streamline API interactions and standardize error handling, we'll create a centralized API client that will:

1. Manage all HTTP requests to the backend
2. Handle authentication if required
3. Transform frontend parameters to match backend expectations
4. Provide consistent error handling
5. Handle response formatting

## API Client Structure

### Core API Client

```typescript
// lib/api-client.ts
import axios from 'axios'

// Initialize axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      // Log or handle specific error codes
      console.error('API Error:', error.response.status, error.response.data)
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
```

### Parameter Transformation

```typescript
// lib/api-helpers.ts
export function timeRangeToParams(timeRange: string): { hours?: number; days?: number } {
  if (!timeRange) return { days: 7 } // Default to 7 days

  const match = timeRange.match(/^(\d+)([hd])$/)
  if (!match) return { days: 7 } // Default to 7 days

  const [, value, unit] = match
  const numValue = parseInt(value, 10)

  return unit === 'h' ? { hours: numValue } : { days: numValue }
}
```

## API Service Modules

For each API category, we'll create a separate service module:

### Detection Service

```typescript
// lib/services/detection-service.ts
import apiClient from '../api-client'

export const detectionService = {
  startDetection: async () => {
    return apiClient.post('/detection/start')
  },
  
  stopDetection: async () => {
    return apiClient.post('/detection/stop')
  },
  
  getStatus: async (cameraId?: string) => {
    const endpoint = cameraId ? `/cameras/${cameraId}/status` : '/status'
    return apiClient.get(endpoint)
  }
}
```

### Metrics Service

```typescript
// lib/services/metrics-service.ts
import apiClient from '../api-client'
import { timeRangeToParams } from '../api-helpers'

export const metricsService = {
  getMetrics: async (timeRange: string) => {
    const params = timeRangeToParams(timeRange)
    return apiClient.get('/metrics', { params })
  },
  
  getSummary: async (timeRange: string) => {
    const params = timeRangeToParams(timeRange)
    return apiClient.get('/metrics/summary', { params })
  },
  
  getDaily: async (timeRange: string) => {
    const params = timeRangeToParams(timeRange)
    return apiClient.get('/metrics/daily', { params })
  }
}
```

### Camera Service

```typescript
// lib/services/camera-service.ts
import apiClient from '../api-client'

export const cameraService = {
  getCameras: async () => {
    return apiClient.get('/cameras')
  },
  
  getCamera: async (cameraId: string) => {
    return apiClient.get(`/cameras/${cameraId}`)
  },
  
  updateCamera: async (cameraId: string, data: any) => {
    return apiClient.put(`/cameras/${cameraId}`, data)
  },
  
  updateROI: async (cameraId: string, roiData: any) => {
    return apiClient.post(`/cameras/${cameraId}/roi`, roiData)
  }
}
```

## Server-Side API Routes

The Next.js API routes will be updated to use these service modules:

```typescript
// app/api/metrics/route.ts
import { NextResponse } from 'next/server'
import { metricsService } from '@/lib/services/metrics-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    
    const response = await metricsService.getMetrics(timeRange)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
```

## Integrating with Components

Components will call the API routes directly:

```typescript
// components/dashboard/hourly-metrics.tsx (excerpt)
useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/metrics?timeRange=${timeRange}`)
      if (response.data && response.data.hourlyData && Array.isArray(response.data.hourlyData)) {
        setData(response.data.hourlyData)
      } else {
        // Improved error handling instead of falling back to mock data
        console.error('Invalid data format received from API')
        setError('Unable to load metrics data. Please try again later.')
      }
    } catch (error) {
      console.error('API error:', error)
      setError('Failed to load metrics data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [timeRange])
```

## Error Handling Strategy

1. **API Client Level**: Handle network errors, timeouts, and common HTTP errors
2. **Service Module Level**: Handle service-specific errors and format responses
3. **API Route Level**: Handle backend-specific errors and format responses for frontend
4. **Component Level**: Display user-friendly error messages and retry mechanisms

## Testing Approach

1. Create mock implementations of the service modules for testing
2. Use MSW (Mock Service Worker) to intercept and mock API requests during tests
3. Update existing Jest mock implementations to reflect the real API structure 