import apiClient from '../api-client'
import { shouldUseMockData } from '../api-helpers'

export interface Camera {
  id: string
  name: string
  source: string | number
  status: string
  person_detected: boolean
}

export interface CameraROI {
  x1: number
  y1: number
  x2: number
  y2: number
  entry_direction: 'LTR' | 'RTL'
}

/**
 * Service for camera-related API calls
 */
export const cameraService = {
  /**
   * Get all cameras
   */
  getCameras: async (): Promise<Camera[]> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return [
        { id: 'main', name: 'Camera main', source: 0, status: 'active', person_detected: false },
        { id: 'secondary', name: 'Camera secondary', source: 'videos/cam_test.mp4', status: 'active', person_detected: false },
      ]
    }
    
    const response = await apiClient.get('/cameras')
    return response.data
  },
  
  /**
   * Get a single camera by ID
   */
  getCamera: async (cameraId: string): Promise<Camera> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        id: cameraId,
        name: `Camera ${cameraId}`,
        source: cameraId === 'main' ? 0 : 'videos/cam_test.mp4',
        status: 'active',
        person_detected: false
      }
    }
    
    const response = await apiClient.get(`/cameras/${cameraId}`)
    return response.data
  },
  
  /**
   * Update camera settings
   */
  updateCamera: async (cameraId: string, data: Partial<Camera>): Promise<Camera> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        id: cameraId,
        name: data.name || `Camera ${cameraId}`,
        source: data.source || (cameraId === 'main' ? 0 : 'videos/cam_test.mp4'),
        status: data.status || 'active',
        person_detected: false
      }
    }
    
    // Using PUT instead of PATCH as mentioned in api_discrepencies.md
    const response = await apiClient.put(`/cameras/${cameraId}`, data)
    return response.data
  },
  
  /**
   * Update camera ROI (Region of Interest)
   */
  updateROI: async (cameraId: string, roiData: CameraROI): Promise<{ success: boolean }> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return { success: true }
    }
    
    // Using the updated ROI format from api_discrepencies.md
    const response = await apiClient.post(`/cameras/${cameraId}/roi`, roiData)
    return response.data
  },
  
  /**
   * Get snapshots for a camera
   */
  getSnapshots: async (cameraId: string): Promise<string[]> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return [
        `/snapshots/${cameraId}/snapshot1.jpg`,
        `/snapshots/${cameraId}/snapshot2.jpg`,
        `/snapshots/${cameraId}/snapshot3.jpg`,
      ]
    }
    
    // Using the updated endpoint path from api_discrepencies.md
    const response = await apiClient.get(`/snapshots/${cameraId}`)
    return response.data
  }
} 