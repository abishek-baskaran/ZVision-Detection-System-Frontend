# Environment Setup

This document outlines the environment setup for connecting the ZVision frontend application to the backend API.

## Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```
# Backend API configuration
NEXT_PUBLIC_BACKEND_URL=http://192.168.31.37:5000
NEXT_PUBLIC_USE_MOCK_DATA=false

# Feature flags
NEXT_PUBLIC_ENABLE_ERROR_LOGGING=true
```

## API Endpoint Structure

All backend API endpoints are prefixed with `/api/`. For example:
- Status endpoint: `http://192.168.31.37:5000/api/status`
- Cameras endpoint: `http://192.168.31.37:5000/api/cameras`

The API client is configured to automatically add this prefix to all requests.

## API Response Structures

The actual backend API returns the following response structures:

### Status Endpoint (/api/status)

```json
{
  "dashboard": {
    "detection_count": 2,
    "direction_counts": {
      "left_to_right": 0,
      "right_to_left": 0,
      "unknown": 0
    },
    "footfall_counts": {
      "entry": 0,
      "exit": 0,
      "unknown": 0
    },
    "last_detection": "2025-04-02 05:02:12",
    "last_direction": null,
    "last_footfall_type": null
  },
  "detection": {
    "main": {
      "camera_id": "main",
      "direction": "unknown",
      "last_detection_time": null,
      "person_detected": false
    },
    "secondary": {
      "camera_id": "secondary",
      "direction": "unknown",
      "last_detection_time": null,
      "person_detected": false
    }
  },
  "detection_active": false,
  "system": {
    "status": "running",
    "timestamp": "2025-04-02 05:15:10"
  }
}
```

### Cameras Endpoint (/api/cameras)

```json
[
  {
    "id": "main",
    "name": "Camera main",
    "person_detected": false,
    "source": 0,
    "status": "active"
  },
  {
    "id": "secondary",
    "name": "Camera secondary",
    "person_detected": false,
    "source": "videos/cam_test.mp4",
    "status": "active"
  }
]
```

## API Client Structure

The API client infrastructure consists of:

1. **Core API Client** (`lib/api-client.ts`): Centralized axios instance for backend communication
   - Automatically adds `/api` prefix to all requests
   - Handles request/response logging and error handling

2. **API Helpers** (`lib/api-helpers.ts`): Utility functions for API parameter transformation

3. **Service Modules** (`lib/services/`): Specialized service modules for different API categories

### Service Modules

The following service modules have been implemented:

- `detection-service.ts`: Detection control and status endpoints
- `metrics-service.ts`: Metrics and summary data endpoints
- `camera-service.ts`: Camera management endpoints
- `event-service.ts`: Event logging endpoints

Each service module:
- Includes type definitions for request and response data
- Provides methods for all related API endpoints
- Includes fallback mock data when `NEXT_PUBLIC_USE_MOCK_DATA=true`
- Handles parameter transformation (e.g., converting timeRange to hours/days)

## Testing the API Connection

A test page is available at `/api-test` to verify the API connection. This page:

1. Displays the configured backend URL (including the `/api` prefix)
2. Provides buttons to test different API endpoints
3. Shows the response from the backend or any errors

## Feature Flags

The following feature flags are available:

- `NEXT_PUBLIC_USE_MOCK_DATA`: When set to `true`, all service modules will use mock data instead of making real API calls
- `NEXT_PUBLIC_ENABLE_ERROR_LOGGING`: When set to `true`, enables detailed error logging

## Next Steps

After verifying the API connection, continue with:

1. Updating API routes to use the service modules
2. Removing mock data fallbacks from components
3. Testing all endpoints and features with the real backend 