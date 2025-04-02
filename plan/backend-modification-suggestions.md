# Backend Modification Suggestions

This document outlines recommended modifications to the backend API that would simplify the frontend-backend integration.

## Time Range Parameter Support

**Current Issue:**
- Frontend uses a simple `timeRange` parameter (e.g., "24h", "7d")
- Backend requires explicit `hours` or `days` parameters
- We've implemented transformation functions but direct support would be cleaner

**Suggested Modification:**
- Add support for a `timeRange` parameter on endpoints that currently use hours/days:
  - `/api/metrics`
  - `/api/metrics/summary`
  - `/api/metrics/daily`
  - `/api/analytics/compare`

## Date Range Filtering for Events

**Current Issue:**
- Frontend has endpoints that expect date range filtering (`from`/`to` dates)
- Backend only supports a `limit` parameter for the events endpoint

**Suggested Modification:**
- Add support for date range filtering on the events endpoint:
  ```
  GET /api/events?from=2023-04-01&to=2023-04-07
  ```

## Event Filtering by Type

**Current Issue:**
- Frontend tries to filter events by `event_type` 
- Backend doesn't appear to support this filtering

**Suggested Modification:**
- Add support for filtering by event type:
  ```
  GET /api/events?types=system&types=error
  ```

## Consistent Response Formats

**Current Issue:**
- Different endpoints have inconsistent response structures
- Some data keys use snake_case, others use camelCase

**Suggested Modification:**
- Standardize on either snake_case or camelCase for all API responses
- Ensure consistent field names across related endpoints

## Camera Metadata and Status

**Current Issue:**
- Camera status information is spread across different endpoints
- Status endpoint structure varies based on whether a camera_id is provided

**Suggested Modification:**
- Provide a unified camera endpoint that includes status information
- Consider adding a parameter to control level of detail:
  ```
  GET /api/cameras/{camera_id}?include=status,roi,detection
  ```

## Support for Batch Operations

**Current Issue:**
- Each camera operation requires a separate API call
- No way to update multiple cameras or settings at once

**Suggested Modification:**
- Add endpoints for batch operations:
  ```
  POST /api/cameras/batch/update
  POST /api/detection/batch/start
  ```

## Pagination Support

**Current Issue:**
- Limited pagination support for endpoints that return collections
- Frontend needs to implement client-side filtering

**Suggested Modification:**
- Add standardized pagination to all collection endpoints:
  ```
  GET /api/events?page=1&per_page=20
  GET /api/cameras?page=1&per_page=20
  ```
  
## Real-time Updates

**Current Issue:**
- Frontend needs to poll for status updates
- No way to receive real-time notifications

**Suggested Modification:**
- Consider adding WebSocket support for real-time events:
  - Detection status changes
  - New events
  - Camera status changes

## Implementation Priority

If you can only make a few changes, I recommend prioritizing these modifications:

1. Time Range Parameter Support - highest impact, simplest change
2. Date Range Filtering for Events - makes historical data more usable
3. Consistent Response Formats - reduces frontend transformation work
4. Pagination Support - helps with scaling to larger datasets 