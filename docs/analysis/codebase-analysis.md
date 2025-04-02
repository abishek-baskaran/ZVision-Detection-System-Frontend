# ZVision Frontend Codebase Analysis

This document provides a comprehensive analysis of the ZVision frontend codebase, focusing on the UI-to-API connections, button mappings, and overall project state.

## Project Structure

### Main Pages

The application consists of the following main pages:

1. **Home Page** (`app/page.tsx`)
   - Landing page with links to all main sections
   - Features four main navigation cards for Camera Management, Dashboard, Events, and Live Monitoring

2. **Dashboard** (`app/dashboard/page.tsx`)
   - Analytics visualization with metrics charts and data summaries
   - Uses time range selector for filtering data

3. **Cameras** (`app/cameras/page.tsx`)
   - Camera management interface
   - Allows adding and configuring cameras
   - Displays camera cards with status toggles

4. **Events** (`app/events/page.tsx`)
   - Event logs and detection history
   - Includes filtering by date range and event type
   - Tab-based interface for different event types

5. **Live Monitoring** (`app/live/page.tsx`)
   - Real-time camera feeds
   - Detection status indicators
   - Camera selection dropdown

### API Structure

The application follows a layered approach to API communication:

1. **API Client** (`lib/api-client.ts`)
   - Centralized Axios instance with base configuration
   - Includes interceptors for request/response handling
   - Error handling and logging

2. **Service Modules** (`lib/services/`)
   - Separate modules for different API domains
   - Encapsulate API calls with proper typing
   - Include fallback to mock data when needed

3. **API Routes** (`app/api/`)
   - Next.js API routes that act as proxies to the backend
   - Handle parameter transformation and response formatting
   - Call service modules for data retrieval

## Frontend-Backend Integration

### API Service Modules

The application uses dedicated service modules for different API domains:

1. **Camera Service** (`camera-service.ts`)
   - Camera management operations
   - ROI (Region of Interest) configuration
   - Camera listing and details

2. **Detection Service** (`detection-service.ts`)
   - Start/stop detection operations
   - Detection status retrieval
   - Detection configuration

3. **Metrics Service** (`metrics-service.ts`)
   - Analytics data retrieval
   - Time-based metrics (hourly, daily)
   - Summary statistics

4. **Event Service** (`event-service.ts`)
   - Event log retrieval
   - Filtering by date range and event type
   - Event history

5. **Analytics Service** (`analytics-service.ts`)
   - Cross-camera comparisons
   - Advanced analytics operations

6. **Snapshot Service** (`snapshot-service.ts`)
   - Camera snapshot retrieval
   - Image handling for detections

### API Helpers

The codebase includes utility functions for API operations:

- `shouldUseMockData()`: Determines if mock data should be used
- `createQueryString()`: Builds query strings for API requests
- `handleApiResponse()`: Validates and processes API responses

## UI Components and API Connections

### Dashboard Components

1. **Hourly Metrics** (`components/dashboard/hourly-metrics.tsx`)
   - **API Endpoint**: `/api/metrics?timeRange={timeRange}`
   - **Data Used**: `hourlyData` array with hour/count pairs
   - **Visualization**: Line chart showing hourly traffic
   - **Error Handling**: Displays alerts for API errors and empty data

2. **Daily Metrics** (`components/dashboard/daily-metrics.tsx`)
   - **API Endpoint**: `/api/metrics/daily?timeRange={timeRange}`
   - **Data Used**: Array of date/count pairs
   - **Visualization**: Bar chart showing daily traffic
   - **Error Handling**: Displays alerts for API errors and empty data

3. **Footfall Metrics** (`components/dashboard/footfall-metrics.tsx`)
   - **API Endpoint**: `/api/metrics?timeRange={timeRange}`
   - **Data Used**: Total count, change percentage, and hourly data
   - **Visualization**: MetricsCard with mini bar chart
   - **Error Handling**: Shows error messages within the card

4. **Camera Comparison** (`components/dashboard/camera-comparison.tsx`)
   - **API Endpoint**: `/api/analytics/compare?timeRange={timeRange}`
   - **Data Used**: Array of camera analytics data
   - **Visualization**: Horizontal bar chart comparing cameras

### Camera Management Components

1. **Camera Card** (`components/cameras/camera-card.tsx`)
   - Displays individual camera information
   - **Controls**:
     - Active/Inactive toggle: Updates camera status
     - Detection toggle: Calls `/api/cameras/{id}` to update detection settings
     - Settings button: Links to camera detail page
     - Remove button: Calls `/api/cameras/{id}` with DELETE method

2. **Add Camera Form** (`components/cameras/add-camera-form.tsx`)
   - Form for adding new cameras
   - **API Endpoint**: POST to `/api/cameras` with camera details
   - Validates camera information before submission

### Live Monitoring Components

1. **Video Feed** (`components/live/video-feed.tsx`)
   - Displays camera video stream
   - Currently uses placeholder images, would connect to actual streams in production
   - Handles loading and error states

2. **Status Panel** (`components/live/status-panel.tsx`)
   - Shows detection status and information
   - **API Endpoint**: `/api/status?camera_id={cameraId}`
   - Updates periodically or via WebSocket

3. **WebSocket Client** (`components/live/websocket-client.tsx`)
   - Provides real-time updates from the backend
   - Handles connection status and message processing

### Event Components

1. **Events List** (`components/events/events-list.tsx`)
   - Displays event logs in a table format
   - **API Endpoint**: `/api/events` with query parameters
   - Includes filters for date range and event type

2. **Date Range Picker** (`components/events/date-range-picker.tsx`)
   - Calendar interface for selecting date ranges
   - Used to filter events by date

## Button Mappings and Actions

### Global Controls

1. **Detection Toggle** (`components/detection-toggle.tsx`)
   - **Action**: Toggles global detection system
   - **API Endpoints**:
     - Enable: POST to `/api/detection/start`
     - Disable: POST to `/api/detection/stop`
   - **UI Feedback**: Shows loading state, success/error toasts

### Camera Controls

1. **Camera Detection Toggle**
   - **Action**: Toggles detection for a specific camera
   - **API Endpoint**: PUT to `/api/cameras/{cameraId}` with `detection_enabled` parameter
   - **UI Feedback**: Color changes, loading indicator, success/error toasts

2. **Camera Status Toggle**
   - **Action**: Activates/deactivates a camera
   - **API Endpoint**: PUT to `/api/cameras/{cameraId}` with `active` parameter
   - **UI Feedback**: Visual state changes, loading state not fully implemented

3. **Camera Removal**
   - **Action**: Removes a camera from the system
   - **API Endpoint**: DELETE to `/api/cameras/{cameraId}`
   - **UI Feedback**: Confirmation dialog, success/error toasts

### Dashboard Controls

1. **Time Range Selector** (`components/dashboard/time-range-selector.tsx`)
   - **Action**: Changes the time range for metrics
   - **Effect**: Updates URL parameters and triggers refetching of metrics data
   - **Options**: 24h, 7d, 30d, custom

## Error Handling and Loading States

1. **API Error Handling**
   - Most components include try/catch blocks for API calls
   - Error states displayed with alert components
   - Toast notifications for user feedback

2. **Loading States**
   - Loading spinners and skeleton loaders
   - Motion animations for smooth transitions
   - Disabled controls during loading

3. **Empty States**
   - Alert components for empty data sets
   - Guidance for user actions when no data is available

## Current Implementation Status

### Completed Features

1. **API Integration**
   - All service modules implemented
   - API routes connected to services
   - Parameter handling and transformation

2. **UI Components**
   - All major pages implemented
   - Charts and visualizations working
   - Form controls and user interactions

3. **Error Handling**
   - Error states for API failures
   - Loading indicators
   - User feedback via toasts

### Pending Improvements

1. **Real-time Updates**
   - WebSocket integration is partially implemented
   - Need to complete real-time event notifications

2. **Camera Stream Integration**
   - Currently using placeholder images
   - Need to connect to actual camera streams

3. **Pagination**
   - Events list lacks proper pagination
   - Large data sets might cause performance issues

4. **Advanced Filtering**
   - More complex filtering options needed for events
   - Advanced search capabilities

5. **Mobile Responsiveness**
   - Some components need improved mobile layouts
   - Touch interactions could be enhanced

## API Endpoint Mapping

| Frontend Component | API Endpoint | HTTP Method | Purpose |
|-------------------|--------------|------------|---------|
| Dashboard metrics | `/api/metrics` | GET | Retrieve hourly metrics data |
| Daily metrics | `/api/metrics/daily` | GET | Retrieve daily metrics data |
| Summary metrics | `/api/metrics/summary` | GET | Retrieve summary statistics |
| Camera comparison | `/api/analytics/compare` | GET | Compare metrics across cameras |
| Camera list | `/api/cameras` | GET | List all cameras |
| Camera details | `/api/cameras/{id}` | GET | Get specific camera details |
| Add camera | `/api/cameras` | POST | Add a new camera |
| Update camera | `/api/cameras/{id}` | PUT | Update camera settings |
| Delete camera | `/api/cameras/{id}` | DELETE | Remove a camera |
| ROI update | `/api/cameras/{id}/roi` | PUT | Update region of interest |
| ROI clear | `/api/cameras/{id}/roi/clear` | POST | Clear region of interest |
| Events list | `/api/events` | GET | Get event logs with filters |
| Detection status | `/api/status` | GET | Get detection system status |
| Start detection | `/api/detection/start` | POST | Start detection system |
| Stop detection | `/api/detection/stop` | POST | Stop detection system |
| Snapshot retrieval | `/api/snapshot/{path}` | GET | Get camera snapshots |

## Recommendations for Next Steps

### High Priority

1. **Complete WebSocket Integration**
   - Implement proper reconnection logic
   - Add real-time event notifications
   - Ensure connection status is visible to users

2. **Enhance Video Feed Component**
   - Connect to actual camera streams
   - Implement proper error handling for stream issues
   - Add controls for stream quality

3. **Implement Proper Pagination**
   - Add server-side pagination for events list
   - Implement infinite scrolling or page navigation
   - Optimize data loading for large datasets

### Medium Priority

1. **Improve Mobile Experience**
   - Enhance responsive layouts
   - Optimize touch interactions
   - Consider a dedicated mobile view for live monitoring

2. **Add Advanced Filtering**
   - More granular date filtering
   - Advanced search capabilities
   - Filter presets for common queries

3. **Implement User Management**
   - User authentication and authorization
   - Role-based access control
   - User preferences

### Low Priority

1. **Visual Refinements**
   - Enhance animations and transitions
   - Improve dark mode support
   - Add customizable themes

2. **Performance Optimizations**
   - Component memoization
   - Data caching strategies
   - Bundle size optimization

3. **Analytics Enhancements**
   - Add exportable reports
   - More visualization options
   - Custom dashboards 