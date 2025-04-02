import apiClient from '../api-client'
import { shouldUseMockData } from '../api-helpers'

export interface HourlyData {
  hour: string
  date: string
  count: number
}

export interface DailyData {
  date: string
  count: number
}

export interface DirectionData {
  ltr: number
  rtl: number
  ltrPercentage: number
  rtlPercentage: number
  change: number
}

export interface MetricsResponse {
  total: number
  change: number
  hourlyData: HourlyData[]
  directions: DirectionData
}

export interface SummaryResponse {
  totalDetections: number
  avgPerDay: number
  peakHour: string
  peakCount: number
  change: number
}

/**
 * Service for metrics-related API calls
 */
export const metricsService = {
  /**
   * Get general metrics with hourly data
   */
  getMetrics: async (timeRange: string = "7d", camId: string | null = null): Promise<MetricsResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      // Parse the time range to determine how many days of data to generate
      const days = parseTimeRange(timeRange)
      const hourlyData: HourlyData[] = []
      
      // Generate data for each day
      for (let day = days - 1; day >= 0; day--) {
        const date = new Date()
        date.setDate(date.getDate() - day)
        const formattedDate = formatDate(date)
        
        // Generate hourly data for this day
        for (let hour = 0; hour < 24; hour++) {
          const hourStr = `${hour.toString().padStart(2, '0')}:00`
          
          // Generate somewhat realistic count values (more during day, less at night)
          let count
          if (hour >= 8 && hour <= 18) {
            // Business hours - higher counts
            count = Math.floor(Math.random() * 50) + 30
          } else if ((hour >= 6 && hour < 8) || (hour > 18 && hour <= 21)) {
            // Transition hours - medium counts
            count = Math.floor(Math.random() * 30) + 15
          } else {
            // Night hours - lower counts
            count = Math.floor(Math.random() * 15) + 2
          }
          
          hourlyData.push({
            hour: hourStr,
            date: formattedDate,
            count
          })
        }
      }
      
      // Calculate total from the hourly data
      const total = hourlyData.reduce((sum, item) => sum + item.count, 0)
      
      // Generate realistic direction data
      const ltr = Math.floor(total * (Math.random() * 0.2 + 0.4)) // 40-60% left-to-right
      const rtl = total - ltr
      const ltrPercentage = parseFloat(((ltr / total) * 100).toFixed(1))
      const rtlPercentage = parseFloat(((rtl / total) * 100).toFixed(1))
      
      return {
        total,
        change: parseFloat((Math.random() * 20 - 5).toFixed(1)), // Random change between -5% and +15%
        hourlyData,
        directions: {
          ltr,
          rtl,
          ltrPercentage,
          rtlPercentage, 
          change: parseFloat((Math.random() * 10 - 3).toFixed(1)), // Random direction change
        },
      }
    }
    
    // Prepare parameters including the camera ID if provided
    const params: Record<string, string> = { timeRange }
    if (camId) {
      params.cam_id = camId
    }
    
    const response = await apiClient.get('/metrics', { params })
    return response.data
  },
  
  /**
   * Get summary metrics
   */
  getSummary: async (timeRange: string = "7d", camId: string | null = null): Promise<SummaryResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      // Parse the time range to determine how many days of data to include
      const days = parseTimeRange(timeRange)
      
      // Generate realistic summary metrics
      // Average counts per day between 150-250
      const avgPerDay = Math.floor(Math.random() * 100) + 150
      const totalDetections = avgPerDay * days
      
      // Random peak hour (business hours more likely)
      const businessHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
      const peakHourIndex = Math.floor(Math.random() * businessHours.length)
      const peakHour = `${businessHours[peakHourIndex]} - ${businessHours[peakHourIndex].split(':')[0]}:59`
      
      // Peak count is higher than average
      const peakCount = Math.floor(avgPerDay / 8) + Math.floor(Math.random() * 20)
      
      // Random change percentage between -10% and +20%
      const change = parseFloat((Math.random() * 30 - 10).toFixed(1))
      
      return {
        totalDetections,
        avgPerDay,
        peakHour,
        peakCount,
        change
      }
    }
    
    // Prepare parameters including the camera ID if provided
    const params: Record<string, string> = { timeRange }
    if (camId) {
      params.cam_id = camId
    }
    
    const response = await apiClient.get('/metrics/summary', { params })
    return response.data
  },
  
  /**
   * Get daily metrics
   */
  getDaily: async (timeRange: string = "7d", camId: string | null = null): Promise<DailyData[]> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      // Parse the time range to determine how many days of data to generate
      const days = parseTimeRange(timeRange)
      const result: DailyData[] = []
      
      // Generate daily data
      for (let day = days - 1; day >= 0; day--) {
        const date = new Date()
        date.setDate(date.getDate() - day)
        const formattedDate = formatDate(date)
        
        // Generate a count between 100-250
        const count = Math.floor(Math.random() * 150) + 100
        
        result.push({
          date: formattedDate,
          count
        })
      }
      
      return result
    }
    
    // Prepare parameters including the camera ID if provided
    const params: Record<string, string> = { timeRange }
    if (camId) {
      params.cam_id = camId
    }
    
    const response = await apiClient.get('/metrics/daily', { params })
    return response.data
  }
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Parse timeRange string into number of days
function parseTimeRange(timeRange: string): number {
  if (timeRange.endsWith('h')) {
    // Convert hours to days (minimum 1 day)
    const hours = parseInt(timeRange.slice(0, -1), 10) || 24
    return Math.max(1, Math.ceil(hours / 24))
  } else if (timeRange.endsWith('d')) {
    return parseInt(timeRange.slice(0, -1), 10) || 7
  } else if (timeRange.endsWith('w')) {
    return (parseInt(timeRange.slice(0, -1), 10) || 1) * 7
  } else {
    // Default to 7 days
    return 7
  }
} 