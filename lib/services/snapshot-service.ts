import apiClient from '../api-client'
import { shouldUseMockData } from '../api-helpers'

export interface SnapshotResponse {
  success: boolean
  path: string
  camera_id: string
  filename: string
  timestamp?: string
}

/**
 * Service for snapshot-related API calls
 */
export const snapshotService = {
  /**
   * Get a specific snapshot by camera ID and filename
   */
  getSnapshot: async (cameraId: string, filename: string): Promise<SnapshotResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        success: true,
        path: `/snapshots/${cameraId}/${filename}`,
        camera_id: cameraId,
        filename: filename,
        timestamp: new Date().toISOString()
      }
    }
    
    // Using the correct endpoint from api discrepancies doc
    const response = await apiClient.get(`/snapshot-image/${cameraId}/${filename}`)
    return response.data
  },
  
  /**
   * Get the latest snapshot for a camera
   */
  getLatestSnapshot: async (cameraId: string): Promise<SnapshotResponse> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return {
        success: true,
        path: `/snapshots/${cameraId}/latest.jpg`,
        camera_id: cameraId,
        filename: 'latest.jpg',
        timestamp: new Date().toISOString()
      }
    }
    
    // Using the correct endpoint from api discrepancies doc
    const response = await apiClient.get(`/snapshot-image/${cameraId}/latest`)
    return response.data
  },
  
  /**
   * Get all snapshots for a camera
   * This method reuses cameraService.getSnapshots() but is included for completeness
   */
  getAllSnapshots: async (cameraId: string): Promise<string[]> => {
    // Use mock data if feature flag is enabled
    if (shouldUseMockData()) {
      return [
        `/snapshots/${cameraId}/snapshot1.jpg`,
        `/snapshots/${cameraId}/snapshot2.jpg`,
        `/snapshots/${cameraId}/snapshot3.jpg`,
      ]
    }
    
    // Using the correct endpoint path
    const response = await apiClient.get(`/snapshots/${cameraId}`)
    return response.data
  }
} 