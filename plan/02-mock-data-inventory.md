# Mock Data Inventory

This document catalogs all instances of mock data implementations in the ZVision frontend codebase that will need to be replaced with real API calls.

## API Routes

### Detection Control

- **Start Detection**: `app/api/detection/start/route.ts`
  - Current: Returns a mock success response
  - Expected: Should make a real request to the backend detection start endpoint

- **Stop Detection**: `app/api/detection/stop/route.ts` 
  - Current: Returns a mock success response
  - Expected: Should make a real request to the backend detection stop endpoint

### Metrics

- **General Metrics**: `app/api/metrics/route.ts`
  - Current: Returns mock hourly data with fixed values
  - Expected: Should call the backend metrics endpoint with proper timeRange transformation to hours/days

- **Summary Metrics**: `app/api/metrics/summary/route.ts`
  - Current: Returns mock summary statistics
  - Expected: Should call the backend metrics summary endpoint with transformed parameters

- **Daily Metrics**: `app/api/metrics/daily/route.ts`
  - Current: Likely returns mock daily data
  - Expected: Should call the backend daily metrics endpoint with transformed parameters

### Status

- **Camera Status**: `app/api/status/route.ts`
  - Current: Returns mock status information
  - Expected: Should call the backend status endpoint using the modified endpoint structure

### Cameras

- **Camera Endpoints**: `app/api/cameras/*/route.ts`
  - Current: Uses mock camera data
  - Expected: Should connect to real backend camera endpoints

## Components with Fallback Mock Data

The following components attempt to call the API but fall back to mock data if the API call fails:

- **Hourly Metrics**: `components/dashboard/hourly-metrics.tsx`
  - Current: Falls back to detailed hourly mock data if API call fails
  - Expected: Should only rely on the real API data

- **Daily Metrics**: `components/dashboard/daily-metrics.tsx`
  - Current: Falls back to mock daily data if API call fails
  - Expected: Should only rely on the real API data

- **Footfall Metrics**: `components/dashboard/footfall-metrics.tsx`
  - Current: Falls back to mock footfall data if API call fails
  - Expected: Should only rely on the real API data

## Test Implementations

The Jest setup file contains mock implementations for testing purposes:

- **Axios Mocks**: `tests/jest.setup.js`
  - Current: Mocks axios get/post/put/delete methods to return empty data
  - Expected: Should be updated to match the real API response structure for testing

## API Data Transformation

Special attention should be paid to:

1. Transforming frontend timeRange parameters (`24h`, `7d`, etc.) to backend parameters (hours, days)
2. Updating all API endpoint paths to match the specifications in `api_discrepencies.md`
3. Handling authentication/authorization if required by the backend 