import apiClient from '../api-client'
import { shouldUseMockData } from '../api-helpers'

export interface CameraAnalytics {
  name: string
  id: string
  count: number
  ltr: number
  rtl: number
}

export interface CompareResponse {
  cameras: CameraAnalytics[]
}

/**
 * Service for analytics-related API calls
 */
export const analyticsService = {
  /**
   * Get analytics comparison data across cameras
   */
  getCompare: async (timeRange: string = "7d"): Promise<CompareResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        cameras: [
          { name: "Front Door", id: "cam-001", count: 425, ltr: 245, rtl: 180 },
          { name: "Backyard", id: "cam-002", count: 132, ltr: 85, rtl: 47 },
          { name: "Garage", id: "cam-003", count: 318, ltr: 190, rtl: 128 },
          { name: "Side Entrance", id: "cam-004", count: 215, ltr: 120, rtl: 95 },
          { name: "Driveway", id: "cam-005", count: 158, ltr: 102, rtl: 56 },
        ],
      }
    }
    
    // Backend now directly supports timeRange parameter
    const params = { timeRange }
    const response = await apiClient.get('/analytics/compare', { params })
    return response.data
  }
} 