# API Changes Documentation

This document outlines recent changes to the backend API endpoints to better support frontend-backend integration.

## Time Range Parameter Support

All metrics endpoints now accept a `timeRange` parameter as an alternative to specifying hours or days explicitly.

### Format

The `timeRange` parameter follows this format:
- For hours: `24h`, `48h`, etc.
- For days: `7d`, `30d`, etc.

### Affected Endpoints

The following endpoints now support the `timeRange` parameter:

- `/api/metrics` - Previously required `hours` parameter
- `/api/metrics/daily` - Previously required `days` parameter  
- `/api/metrics/summary` - Previously required `days` parameter
- `/api/analytics/compare` - Previously required `hours` or `days` parameter

### Examples

```
GET /api/metrics?timeRange=24h
GET /api/metrics/daily?timeRange=7d
GET /api/metrics/summary?timeRange=30d
GET /api/analytics/compare?timeRange=24h
```

## Date Range Filtering for Events

Event endpoints now support date range filtering with `from` and `to` parameters.

### Format

The date parameters follow the YYYY-MM-DD format:
- `from` - Start date (inclusive)
- `to` - End date (inclusive)

### Affected Endpoints

The following endpoints now support date range filtering:

- `/api/events` - Previously only supported a `limit` parameter
- `/api/detections/recent` - Previously only supported a `count` parameter

### Examples

```
GET /api/events?from=2023-04-01&to=2023-04-07
GET /api/detections/recent?from=2023-04-01&to=2023-04-07&count=50
```

## Parameter Precedence

When multiple parameters are provided:

1. For time range parameters, `timeRange` has precedence over `hours` or `days`
2. The `limit` or `count` parameter can be combined with date filters
3. If no date filters are provided, the endpoint returns the most recent events 