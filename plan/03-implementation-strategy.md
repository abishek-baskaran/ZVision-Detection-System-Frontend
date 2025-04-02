# Implementation Strategy

This document outlines the strategy for replacing mock data with real API calls in the ZVision frontend application.

## Approach

We will take an incremental approach to replacing mock data with real API calls to minimize disruption and ensure smooth integration. The implementation will follow these phases:

1. **Setup Phase**: Environment configuration and API client setup
2. **API Route Transformation**: Update API routes to connect with backend
3. **Component Updates**: Remove fallback mock data from components
4. **Testing & Validation**: Verify functionality with real API endpoints

## 1. Setup Phase

### Environment Configuration

1. Create or update environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Base URL for backend API endpoints
   - Additional variables for authentication if needed

2. Create utility functions for API calls:
   - Implement a centralized API client (e.g., in `lib/api-client.ts`)
   - Include error handling and authentication logic
   - Implement timeRange parameter transformation

### API Parameter Transformation

Create a utility function to convert frontend timeRange parameters to backend parameters:
- `24h` → `hours=24`
- `7d` → `days=7`
- etc.

## 2. API Route Transformation

Update API routes in the following order:

1. **Core Functionality**:
   - Detection control (start/stop)
   - Camera status endpoints

2. **Data Visualization Components**:
   - Metrics endpoints
   - Analytics endpoints

3. **Secondary Features**:
   - Event endpoints
   - Snapshot endpoints

For each API route:
1. Update endpoint URLs according to `api_discrepencies.md`
2. Replace mock data with real API calls
3. Implement error handling
4. Ensure response format matches what frontend components expect

## 3. Component Updates

After API routes are updated to use real data:

1. Remove fallback mock data from components
2. Improve error handling in components
3. Update any component logic that depends on specific mock data structure

## 4. Testing & Validation

For each updated API route and component:

1. Test with real backend API
2. Verify error handling
3. Update tests to reflect real API structure
4. Document any backend API issues encountered

## Fallback Strategy

In case of backend service unavailability during development:

1. Implement a feature flag system to toggle between real API calls and mock data
2. Use environment variables to control this behavior
3. Keep mock data implementations in a separate module for development purposes

## Timeline and Prioritization

1. **High Priority**:
   - Core detection functionality (start/stop)
   - Status endpoints
   
2. **Medium Priority**:
   - Dashboard metrics
   - Camera management
   
3. **Lower Priority**:
   - Event history
   - Analytics 