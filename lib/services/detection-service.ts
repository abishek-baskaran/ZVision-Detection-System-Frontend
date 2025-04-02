import apiClient from '../api-client'
import { shouldUseMockData } from '../api-helpers'

interface DetectionResponse {
  success: boolean
  message: string
}

interface CameraDetectionStatus {
  camera_id: string
  direction: string
  last_detection_time: string | null
  person_detected: boolean
}

interface DirectionCounts {
  left_to_right: number
  right_to_left: number
  unknown: number
}

interface FootfallCounts {
  entry: number
  exit: number
  unknown: number
}

interface DashboardInfo {
  detection_count: number
  direction_counts: DirectionCounts
  footfall_counts: FootfallCounts
  last_detection: string | null
  last_direction: string | null
  last_footfall_type: string | null
}

interface SystemInfo {
  status: string
  timestamp: string
}

interface DetectionStatusResponse {
  dashboard: DashboardInfo
  detection: Record<string, CameraDetectionStatus>
  detection_active: boolean
  system: SystemInfo
}

/**
 * Service for detection-related API calls
 */
export const detectionService = {
  /**
   * Start the detection system
   */
  startDetection: async (): Promise<DetectionResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        success: true,
        message: "Detection started successfully (mock)",
      }
    }
    
    const response = await apiClient.post('/detection/start')
    return response.data
  },
  
  /**
   * Stop the detection system
   */
  stopDetection: async (): Promise<DetectionResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        success: true,
        message: "Detection stopped successfully (mock)",
      }
    }
    
    const response = await apiClient.post('/detection/stop')
    return response.data
  },
  
  /**
   * Get detection status, globally or for a specific camera
   */
  getStatus: async (cameraId?: string): Promise<DetectionStatusResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        dashboard: {
          detection_count: 25,
          direction_counts: {
            left_to_right: 15,
            right_to_left: 10,
            unknown: 0
          },
          footfall_counts: {
            entry: 15,
            exit: 10,
            unknown: 0
          },
          last_detection: new Date().toISOString(),
          last_direction: Math.random() > 0.5 ? "left_to_right" : "right_to_left",
          last_footfall_type: Math.random() > 0.5 ? "entry" : "exit"
        },
        detection: {
          main: {
            camera_id: "main",
            direction: "unknown",
            last_detection_time: new Date().toISOString(),
            person_detected: Math.random() > 0.5
          },
          secondary: {
            camera_id: "secondary",
            direction: "unknown",
            last_detection_time: new Date().toISOString(),
            person_detected: Math.random() > 0.5
          }
        },
        detection_active: true,
        system: {
          status: "running",
          timestamp: new Date().toISOString()
        }
      }
    }
    
    // Use the modified endpoint structure from api_discrepencies.md
    const endpoint = cameraId ? `/cameras/${cameraId}/status` : '/status'
    const response = await apiClient.get(endpoint)
    return response.data
  }
} 