# ZVision API Reference

This document provides a comprehensive reference for all API endpoints used in the ZVision frontend application, including parameters, response formats, and usage examples.

## Table of Contents

1. [Camera Management](#camera-management)
2. [Detection Control](#detection-control)
3. [Metrics and Analytics](#metrics-and-analytics)
4. [Events and Logs](#events-and-logs)
5. [Status Information](#status-information)
6. [Snapshots](#snapshots)

## Camera Management

### List All Cameras

Retrieves a list of all cameras configured in the system.

**Endpoint:** `GET /api/cameras`

**Response Format:**
```json
[
  {
    "id": "cam-001",
    "name": "Front Door",
    "source": "rtsp://192.168.1.100:554/stream1",
    "active": true,
    "detection_enabled": true,
    "roi": {
      "x": 50,
      "y": 100,
      "width": 200,
      "height": 150
    },
    "entry_direction": "LTR"
  },
  {
    "id": "cam-002",
    "name": "Backyard",
    "source": "rtsp://192.168.1.101:554/stream1",
    "active": false,
    "detection_enabled": false
  }
]
```

**Frontend Component:** `cameras/page.tsx`

**Code Example:**
```typescript
// Using service module
import { cameraService } from "@/lib/services"

const cameras = await cameraService.getCameras()

// Direct API call
const response = await axios.get("/api/cameras")
const cameras = response.data
```

### Get Camera Details

Retrieves details for a specific camera.

**Endpoint:** `GET /api/cameras/{id}`

**Parameters:**
- `id` (path): Camera ID

**Response Format:**
```json
{
  "id": "cam-001",
  "name": "Front Door",
  "source": "rtsp://192.168.1.100:554/stream1",
  "active": true,
  "detection_enabled": true,
  "roi": {
    "x": 50,
    "y": 100,
    "width": 200,
    "height": 150
  },
  "entry_direction": "LTR"
}
```

**Frontend Component:** `cameras/[id]/page.tsx`

**Code Example:**
```typescript
// Using service module
import { cameraService } from "@/lib/services"

const cameraId = "cam-001"
const camera = await cameraService.getCamera(cameraId)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cameras/${cameraId}`)
const camera = response.data
```

### Add New Camera

Adds a new camera to the system.

**Endpoint:** `POST /api/cameras`

**Request Body:**
```json
{
  "name": "New Camera",
  "source": "rtsp://192.168.1.105:554/stream1",
  "entry_direction": "LTR"
}
```

**Response Format:**
```json
{
  "id": "cam-006",
  "name": "New Camera",
  "source": "rtsp://192.168.1.105:554/stream1",
  "active": true,
  "detection_enabled": false,
  "entry_direction": "LTR"
}
```

**Frontend Component:** `components/cameras/add-camera-form.tsx`

**Code Example:**
```typescript
// Using service module
import { cameraService } from "@/lib/services"

const newCamera = {
  name: "New Camera",
  source: "rtsp://192.168.1.105:554/stream1",
  entry_direction: "LTR"
}
const result = await cameraService.addCamera(newCamera)

// Direct API call
const response = await axios.post("/api/cameras", newCamera)
const result = response.data
```

### Update Camera

Updates an existing camera's settings.

**Endpoint:** `PUT /api/cameras/{id}`

**Parameters:**
- `id` (path): Camera ID

**Request Body:**
```json
{
  "name": "Updated Camera Name",
  "active": true,
  "detection_enabled": true,
  "entry_direction": "RTL"
}
```

**Response Format:**
```json
{
  "id": "cam-001",
  "name": "Updated Camera Name",
  "source": "rtsp://192.168.1.100:554/stream1",
  "active": true,
  "detection_enabled": true,
  "roi": {
    "x": 50,
    "y": 100,
    "width": 200,
    "height": 150
  },
  "entry_direction": "RTL"
}
```

**Frontend Component:** `components/cameras/camera-card.tsx`

**Code Example:**
```typescript
// Using service module
import { cameraService } from "@/lib/services"

const cameraId = "cam-001"
const updates = {
  name: "Updated Camera Name",
  detection_enabled: true
}
const result = await cameraService.updateCamera(cameraId, updates)

// Direct API call
const response = await axios.put(`/api/cameras/${cameraId}`, updates)
const result = response.data
```

### Delete Camera

Removes a camera from the system.

**Endpoint:** `DELETE /api/cameras/{id}`

**Parameters:**
- `id` (path): Camera ID

**Response Format:**
```json
{
  "success": true,
  "message": "Camera deleted successfully"
}
```

**Frontend Component:** `components/cameras/camera-card.tsx`

**Code Example:**
```typescript
// Using service module
import { cameraService } from "@/lib/services"

const cameraId = "cam-001"
const result = await cameraService.deleteCamera(cameraId)

// Direct API call
const response = await axios.delete(`/api/cameras/${cameraId}`)
const result = response.data
```

### Update Region of Interest (ROI)

Updates the region of interest for a camera.

**Endpoint:** `PUT /api/cameras/{id}/roi`

**Parameters:**
- `id` (path): Camera ID

**Request Body:**
```json
{
  "x": 100,
  "y": 150,
  "width": 300,
  "height": 200
}
```

**Response Format:**
```json
{
  "success": true,
  "camera_id": "cam-001",
  "roi": {
    "x": 100,
    "y": 150,
    "width": 300,
    "height": 200
  }
}
```

**Frontend Component:** `components/cameras/roi-editor.tsx`

**Code Example:**
```typescript
// Using service module
import { cameraService } from "@/lib/services"

const cameraId = "cam-001"
const roi = {
  x: 100,
  y: 150,
  width: 300,
  height: 200
}
const result = await cameraService.updateROI(cameraId, roi)

// Direct API call
const response = await axios.put(`/api/cameras/${cameraId}/roi`, roi)
const result = response.data
```

### Clear Region of Interest (ROI)

Removes the region of interest for a camera.

**Endpoint:** `POST /api/cameras/{id}/roi/clear`

**Parameters:**
- `id` (path): Camera ID

**Response Format:**
```json
{
  "success": true,
  "camera_id": "cam-001",
  "message": "ROI cleared successfully"
}
```

**Frontend Component:** `components/cameras/roi-editor.tsx`

**Code Example:**
```typescript
// Using service module
import { cameraService } from "@/lib/services"

const cameraId = "cam-001"
const result = await cameraService.clearROI(cameraId)

// Direct API call
const response = await axios.post(`/api/cameras/${cameraId}/roi/clear`)
const result = response.data
```

## Detection Control

### Start Detection

Starts the detection system globally or for a specific camera.

**Endpoint:** `POST /api/detection/start`

**Request Body (Optional):**
```json
{
  "camera_id": "cam-001"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Detection started",
  "camera_id": "cam-001"  // Only if camera_id was provided
}
```

**Frontend Component:** `components/detection-toggle.tsx`

**Code Example:**
```typescript
// Using service module
import { detectionService } from "@/lib/services"

// Global start
const result = await detectionService.startDetection()

// Camera-specific start
const cameraId = "cam-001"
const result = await detectionService.startDetection(cameraId)

// Direct API call
const response = await axios.post("/api/detection/start", { camera_id: cameraId })
const result = response.data
```

### Stop Detection

Stops the detection system globally or for a specific camera.

**Endpoint:** `POST /api/detection/stop`

**Request Body (Optional):**
```json
{
  "camera_id": "cam-001"
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Detection stopped",
  "camera_id": "cam-001"  // Only if camera_id was provided
}
```

**Frontend Component:** `components/detection-toggle.tsx`

**Code Example:**
```typescript
// Using service module
import { detectionService } from "@/lib/services"

// Global stop
const result = await detectionService.stopDetection()

// Camera-specific stop
const cameraId = "cam-001"
const result = await detectionService.stopDetection(cameraId)

// Direct API call
const response = await axios.post("/api/detection/stop", { camera_id: cameraId })
const result = response.data
```

## Metrics and Analytics

### Get Hourly Metrics

Retrieves hourly traffic metrics.

**Endpoint:** `GET /api/metrics`

**Parameters:**
- `timeRange` (query): Time range in format like "24h", "7d", "30d"

**Response Format:**
```json
{
  "total": 1248,
  "change": 12.5,
  "hourlyData": [
    {
      "hour": "00:00",
      "count": 12
    },
    {
      "hour": "01:00",
      "count": 8
    },
    // ... more hours
  ]
}
```

**Frontend Component:** `components/dashboard/hourly-metrics.tsx`

**Code Example:**
```typescript
// Using service module
import { metricsService } from "@/lib/services"

const timeRange = "24h"
const metrics = await metricsService.getMetrics(timeRange)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/metrics?timeRange=${timeRange}`)
const metrics = response.data
```

### Get Daily Metrics

Retrieves daily traffic metrics.

**Endpoint:** `GET /api/metrics/daily`

**Parameters:**
- `timeRange` (query): Time range in format like "7d", "30d", "90d"

**Response Format:**
```json
[
  {
    "date": "2023-04-01",
    "count": 145
  },
  {
    "date": "2023-04-02",
    "count": 167
  },
  // ... more days
]
```

**Frontend Component:** `components/dashboard/daily-metrics.tsx`

**Code Example:**
```typescript
// Using service module
import { metricsService } from "@/lib/services"

const timeRange = "7d"
const dailyMetrics = await metricsService.getDaily(timeRange)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/metrics/daily?timeRange=${timeRange}`)
const dailyMetrics = response.data
```

### Get Metrics Summary

Retrieves summary statistics for traffic metrics.

**Endpoint:** `GET /api/metrics/summary`

**Parameters:**
- `timeRange` (query): Time range in format like "24h", "7d", "30d"

**Response Format:**
```json
{
  "total": 1248,
  "average": 178.3,
  "peak": {
    "value": 245,
    "time": "2023-04-05T15:00:00Z"
  },
  "change": 12.5,
  "direction": {
    "ltr": 748,
    "rtl": 500
  }
}
```

**Frontend Component:** `components/dashboard/summary-metrics.tsx`

**Code Example:**
```typescript
// Using service module
import { metricsService } from "@/lib/services"

const timeRange = "7d"
const summary = await metricsService.getSummary(timeRange)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/metrics/summary?timeRange=${timeRange}`)
const summary = response.data
```

### Get Camera Comparison

Retrieves comparative analytics across cameras.

**Endpoint:** `GET /api/analytics/compare`

**Parameters:**
- `timeRange` (query): Time range in format like "24h", "7d", "30d"

**Response Format:**
```json
{
  "cameras": [
    {
      "name": "Front Door",
      "id": "cam-001",
      "count": 425,
      "ltr": 245,
      "rtl": 180
    },
    {
      "name": "Backyard",
      "id": "cam-002",
      "count": 132,
      "ltr": 85,
      "rtl": 47
    },
    // ... more cameras
  ]
}
```

**Frontend Component:** `components/dashboard/camera-comparison.tsx`

**Code Example:**
```typescript
// Using service module
import { analyticsService } from "@/lib/services"

const timeRange = "7d"
const comparison = await analyticsService.getCompare(timeRange)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/compare?timeRange=${timeRange}`)
const comparison = response.data
```

## Events and Logs

### Get Events

Retrieves system events and logs with filtering options.

**Endpoint:** `GET /api/events`

**Parameters:**
- `from` (query, optional): Start date in ISO format (e.g., "2023-04-01T00:00:00Z")
- `to` (query, optional): End date in ISO format (e.g., "2023-04-07T23:59:59Z")
- `types` (query, optional): Event types to include (e.g., "system", "error")
- `limit` (query, optional): Maximum number of events to return (default: 50)

**Response Format:**
```json
[
  {
    "id": "evt-001",
    "timestamp": "2023-04-07T08:23:15Z",
    "event_type": "system",
    "message": "System started",
    "camera_id": null
  },
  {
    "id": "evt-002",
    "timestamp": "2023-04-07T09:15:22Z",
    "event_type": "error",
    "message": "Connection lost to camera cam-002",
    "camera_id": "cam-002"
  },
  // ... more events
]
```

**Frontend Component:** `components/events/events-list.tsx`

**Code Example:**
```typescript
// Using service module
import { eventService } from "@/lib/services"

const filters = {
  from: new Date("2023-04-01"),
  to: new Date("2023-04-07"),
  types: ["system", "error"],
  limit: 100
}
const events = await eventService.getEvents(filters)

// Direct API call
const queryParams = new URLSearchParams()
if (filters.from) queryParams.append("from", filters.from.toISOString())
if (filters.to) queryParams.append("to", filters.to.toISOString())
filters.types.forEach(type => queryParams.append("types", type))
queryParams.append("limit", filters.limit.toString())

const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events?${queryParams.toString()}`)
const events = response.data
```

### Get Recent Detections

Retrieves recent detection events.

**Endpoint:** `GET /api/detections/recent`

**Parameters:**
- `from` (query, optional): Start date in ISO format
- `to` (query, optional): End date in ISO format
- `camera_id` (query, optional): Filter by camera ID
- `limit` (query, optional): Maximum number of detections to return (default: 20)

**Response Format:**
```json
[
  {
    "id": "det-001",
    "timestamp": "2023-04-07T08:30:15Z",
    "camera_id": "cam-001",
    "direction": "LTR",
    "confidence": 0.92,
    "snapshot_path": "/snapshots/det-001.jpg"
  },
  {
    "id": "det-002",
    "timestamp": "2023-04-07T09:12:33Z",
    "camera_id": "cam-003",
    "direction": "RTL",
    "confidence": 0.87,
    "snapshot_path": "/snapshots/det-002.jpg"
  },
  // ... more detections
]
```

**Frontend Component:** `components/events/detection-list.tsx`

**Code Example:**
```typescript
// Using service module
import { detectionService } from "@/lib/services"

const filters = {
  from: new Date("2023-04-01"),
  to: new Date("2023-04-07"),
  camera_id: "cam-001",
  limit: 20
}
const detections = await detectionService.getRecentDetections(filters)

// Direct API call
const queryParams = new URLSearchParams()
if (filters.from) queryParams.append("from", filters.from.toISOString())
if (filters.to) queryParams.append("to", filters.to.toISOString())
if (filters.camera_id) queryParams.append("camera_id", filters.camera_id)
queryParams.append("limit", filters.limit.toString())

const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/detections/recent?${queryParams.toString()}`)
const detections = response.data
```

## Status Information

### Get Detection Status

Retrieves the current detection system status.

**Endpoint:** `GET /api/status`

**Parameters:**
- `camera_id` (query, optional): Camera ID to get status for a specific camera

**Response Format (Global Status):**
```json
{
  "detection_active": true,
  "cameras_active": 4,
  "cameras_total": 5,
  "last_detection_time": "2023-04-07T08:30:15Z"
}
```

**Response Format (Camera-specific Status):**
```json
{
  "detection_active": true,
  "person_detected": false,
  "last_detection_time": "2023-04-07T08:30:15Z",
  "camera_id": "cam-001",
  "direction": "LTR"
}
```

**Frontend Component:** `components/live/status-panel.tsx`

**Code Example:**
```typescript
// Using service module
import { detectionService } from "@/lib/services"

// Global status
const globalStatus = await detectionService.getStatus()

// Camera-specific status
const cameraId = "cam-001"
const cameraStatus = await detectionService.getStatus(cameraId)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status?camera_id=${cameraId}`)
const status = response.data
```

## Snapshots

### Get Snapshot

Retrieves a snapshot image for a camera.

**Endpoint:** `GET /api/snapshot/{camera_id}/{filename}`

**Parameters:**
- `camera_id` (path): Camera ID
- `filename` (path): Snapshot filename

**Response Format:**
```json
{
  "success": true,
  "path": "/snapshots/cam-001/snapshot.jpg",
  "camera_id": "cam-001",
  "filename": "snapshot.jpg",
  "timestamp": "2023-04-07T08:30:15Z"
}
```

**Frontend Component:** `components/events/detection-item.tsx`

**Code Example:**
```typescript
// Using service module
import { snapshotService } from "@/lib/services"

const cameraId = "cam-001"
const filename = "snapshot.jpg"
const snapshot = await snapshotService.getSnapshot(cameraId, filename)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/snapshot/${cameraId}/${filename}`)
const snapshot = response.data
```

### Get Latest Snapshot

Retrieves the latest snapshot for a camera.

**Endpoint:** `GET /api/snapshot/{camera_id}`

**Parameters:**
- `camera_id` (path): Camera ID

**Response Format:**
```json
{
  "success": true,
  "path": "/snapshots/cam-001/latest.jpg",
  "camera_id": "cam-001",
  "filename": "latest.jpg",
  "timestamp": "2023-04-07T08:30:15Z"
}
```

**Frontend Component:** `components/cameras/camera-preview.tsx`

**Code Example:**
```typescript
// Using service module
import { snapshotService } from "@/lib/services"

const cameraId = "cam-001"
const latestSnapshot = await snapshotService.getLatestSnapshot(cameraId)

// Direct API call
const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/snapshot/${cameraId}`)
const latestSnapshot = response.data
``` 