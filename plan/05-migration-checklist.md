# Migration Checklist

This document provides a detailed checklist for migrating from mock data to real API calls in the ZVision frontend application.

## Prerequisites

- [ ] Backend API is accessible and endpoints are documented
- [ ] Environment variables are set up
- [ ] API client and service modules are implemented
- [ ] Parameter transformation utilities are in place

## Phase 1: Core Functionality

### Detection Control

- [ ] Update `app/api/detection/start/route.ts`
  - [ ] Implement real API call to backend endpoint
  - [ ] Handle error cases
  - [ ] Test with actual backend

- [ ] Update `app/api/detection/stop/route.ts`
  - [ ] Implement real API call to backend endpoint
  - [ ] Handle error cases
  - [ ] Test with actual backend

### Status Endpoints

- [ ] Update `app/api/status/route.ts`
  - [ ] Implement real API call to backend endpoint
  - [ ] Update path to match `api_discrepencies.md`
  - [ ] Handle error cases
  - [ ] Test with actual backend

## Phase 2: Data Visualization

### Metrics

- [ ] Update `app/api/metrics/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Transform timeRange parameter
  - [ ] Handle error cases
  - [ ] Test with actual backend

- [ ] Update `app/api/metrics/summary/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Transform timeRange parameter
  - [ ] Handle error cases
  - [ ] Test with actual backend

- [ ] Update `app/api/metrics/daily/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Transform timeRange parameter
  - [ ] Handle error cases
  - [ ] Test with actual backend

### Analytics

- [ ] Update `app/api/analytics/compare/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Update parameters according to `api_discrepencies.md`
  - [ ] Handle error cases
  - [ ] Test with actual backend

## Phase 3: Components

### Dashboard Components

- [ ] Update `components/dashboard/hourly-metrics.tsx`
  - [ ] Remove mock data fallback
  - [ ] Improve error handling
  - [ ] Test with actual backend data

- [ ] Update `components/dashboard/daily-metrics.tsx`
  - [ ] Remove mock data fallback
  - [ ] Improve error handling
  - [ ] Test with actual backend data

- [ ] Update `components/dashboard/footfall-metrics.tsx`
  - [ ] Remove mock data fallback
  - [ ] Improve error handling
  - [ ] Test with actual backend data

## Phase 4: Secondary Features

### Events

- [ ] Update `app/api/events/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Update parameters according to `api_discrepencies.md`
  - [ ] Handle error cases
  - [ ] Test with actual backend

### Cameras

- [ ] Update `app/api/cameras/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Handle error cases
  - [ ] Test with actual backend

- [ ] Update `app/api/cameras/[id]/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Handle error cases
  - [ ] Test with actual backend

- [ ] Update `app/api/cameras/[id]/roi/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Update request body format according to `api_discrepencies.md`
  - [ ] Handle error cases
  - [ ] Test with actual backend

### Snapshots

- [ ] Update `app/api/snapshot/route.ts`
  - [ ] Replace mock data with real API call
  - [ ] Update endpoint path according to `api_discrepencies.md`
  - [ ] Handle error cases
  - [ ] Test with actual backend

## Phase 5: Testing

- [ ] Update Jest mock implementations
  - [ ] Update `tests/jest.setup.js` for axios mocks
  - [ ] Create API service mocks

- [ ] Create integration tests
  - [ ] Test API routes with real backend
  - [ ] Test component integration with real API calls

## Phase 6: Documentation & Clean-up

- [ ] Document any discrepancies found during implementation
- [ ] Remove any unused mock data files or implementations
- [ ] Update README with new API connection information
- [ ] Add any necessary environment variables to documentation
- [ ] Document error handling approach and fallback strategies

## Final Validation

- [ ] Test all components with real backend
- [ ] Verify all features function as expected
- [ ] Check error handling in edge cases (backend unavailable, etc.)
- [ ] Check performance and optimize if necessary 