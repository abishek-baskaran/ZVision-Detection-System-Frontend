import apiClient from '../api-client'
import { shouldUseMockData } from '../api-helpers'

export interface Event {
  id: string
  title: string
  description: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'system'
  camera?: string
}

/**
 * Service for events-related API calls
 */
export const eventService = {
  /**
   * Get events with optional filtering
   * @param limit Optional limit of events to return
   * @param from Optional start date for filtering
   * @param to Optional end date for filtering
   * @param types Optional event types to filter by
   */
  getEvents: async (
    limit?: number,
    from?: string,
    to?: string,
    types?: string[]
  ): Promise<Event[]> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'System started',
          description: 'Detection system was started',
          timestamp: '2023-04-07T08:12:45Z',
          level: 'system',
        },
        {
          id: '2',
          title: 'Connection issue',
          description: 'Camera 1 connection was lost temporarily',
          timestamp: '2023-04-06T15:32:18Z',
          level: 'warning',
          camera: 'Camera 1',
        },
        {
          id: '3',
          title: 'New detection',
          description: 'New person detected in restricted area',
          timestamp: '2023-04-06T10:04:22Z',
          level: 'info',
          camera: 'Camera 2',
        },
        {
          id: '4',
          title: 'Storage warning',
          description: 'Storage space is running low (15% remaining)',
          timestamp: '2023-04-05T22:45:11Z',
          level: 'warning',
        },
        {
          id: '5',
          title: 'System error',
          description: 'Processing error occurred in detection module',
          timestamp: '2023-04-04T13:18:45Z',
          level: 'error',
        },
      ]
      return mockEvents
    }
    
    // Prepare query parameters
    const params: Record<string, any> = {}
    
    if (limit) params.limit = limit
    if (from) params.from = from
    if (to) params.to = to
    if (types && types.length > 0) params.types = types
    
    const response = await apiClient.get('/events', { params })
    return response.data
  }
} 