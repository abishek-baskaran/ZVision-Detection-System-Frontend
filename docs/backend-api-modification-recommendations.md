# Backend API Endpoint Modification Recommendations

## Overview

The frontend components are currently displaying error messages because the API response formats from the backend don't match what the frontend components expect. This document outlines the necessary modifications needed to align the backend API responses with the frontend expectations.

## Current API Response vs. Expected Format

### 1. Metrics Endpoint (`/api/metrics?timeRange=7d`)

#### Current Response:
```json
{
    "footfall_count": {
        "entry": 0,
        "exit": 0,
        "unknown": 0
    },
    "hourly": {
        "2025-04-02 05:00": {
            "detection_count": 2,
            "entry": 0,
            "exit": 0,
            "left_to_right": 0,
            "right_to_left": 0,
            "unknown": 0
        }
    },
    "total": {
        "detection_count": 2,
        "direction_counts": {
            "left_to_right": 0,
            "right_to_left": 0,
            "unknown": 0
        }
    }
}
```

#### Expected Response:
```json
{
    "total": 2,
    "change": 0,
    "hourlyData": [
        {
            "hour": "05:00",
            "count": 2
        }
    ],
    "directions": {
        "ltr": 0,
        "rtl": 0,
        "ltrPercentage": 0,
        "rtlPercentage": 0,
        "change": 0
    }
}
```

#### Required Modifications:
- Transform `total.detection_count` to a top-level `total` field
- Add a `change` field (percentage change from previous period)
- Convert `hourly` object to an `hourlyData` array with simplified structure
- Add a `directions` object with directional data and calculated percentages

### 2. Summary Endpoint (`/api/metrics/summary?timeRange=7d`)

#### Current Response:
```json
{
    "direction_counts": {
        "left_to_right": 0,
        "right_to_left": 2,
        "unknown": 45
    },
    "period_days": 7,
    "total_detections": 47
}
```

#### Expected Response:
```json
{
    "totalDetections": 47,
    "avgPerDay": 6.7,
    "peakHour": "Not Available",
    "peakCount": 0,
    "change": 0
}
```

#### Required Modifications:
- Rename `total_detections` to `totalDetections`
- Calculate `avgPerDay` by dividing `totalDetections` by `period_days`
- Add `peakHour` and `peakCount` fields (calculated from hourly data)
- Add a `change` field (percentage change from previous period)

### 3. Daily Metrics Endpoint (`/api/metrics/daily?timeRange=7d`)

#### Current Response:
```json
{
    "2025-04-02": {
        "detection_count": 2,
        "left_to_right": 0,
        "right_to_left": 0,
        "unknown": 0
    }
}
```

#### Expected Response:
```json
[
    {
        "date": "2025-04-02",
        "count": 2
    }
]
```

#### Required Modifications:
- Transform the object into an array of daily records
- Each daily record should have `date` and `count` fields
- Map `detection_count` to `count`

### 4. Camera Comparison Endpoint (`/api/analytics/compare?timeRange=7d`)

#### Current Response:
```json
{
    "camera_counts": {
        "main": 64,
        "secondary": 1
    },
    "time_period": "Last 168 hours",
    "total": 65
}
```

#### Expected Response:
```json
{
    "cameras": [
        {
            "name": "main",
            "id": "main",
            "count": 64,
            "ltr": 0,
            "rtl": 0
        },
        {
            "name": "secondary",
            "id": "secondary",
            "count": 1,
            "ltr": 0,
            "rtl": 0
        }
    ]
}
```

#### Required Modifications:
- Transform `camera_counts` object into a `cameras` array
- Each camera should have `name`, `id`, `count`, `ltr`, and `rtl` fields
- Default `ltr` and `rtl` to 0 if not available

## Implementation Recommendations

### 1. Add Response Transformers

Create transformation functions in the backend code to convert the internal data structures to the expected frontend formats:

```python
# Example transformation function for metrics endpoint
def transform_metrics_response(data):
    total_count = data["total"]["detection_count"]
    
    hourly_data = []
    for timestamp, hourly in data["hourly"].items():
        hour = timestamp.split()[1]  # Extract hour part
        hourly_data.append({
            "hour": hour,
            "count": hourly["detection_count"]
        })
    
    # Calculate direction percentages
    ltr = data["total"]["direction_counts"]["left_to_right"]
    rtl = data["total"]["direction_counts"]["right_to_left"]
    total_directions = ltr + rtl
    
    ltr_percentage = (ltr / total_directions * 100) if total_directions > 0 else 0
    rtl_percentage = (rtl / total_directions * 100) if total_directions > 0 else 0
    
    return {
        "total": total_count,
        "change": 0,  # Calculate from historical data if available
        "hourlyData": hourly_data,
        "directions": {
            "ltr": ltr,
            "rtl": rtl,
            "ltrPercentage": round(ltr_percentage, 1),
            "rtlPercentage": round(rtl_percentage, 1),
            "change": 0
        }
    }
```

### 2. Add Calculations for Derived Fields

Implement the logic needed to calculate fields like:
- Average per day
- Change percentage (compared to previous period)
- Peak hours and counts
- Directional percentages

### 3. Handle Edge Cases

Ensure transformation functions handle:
- Missing data
- Division by zero when calculating percentages
- Empty date ranges
- Null or undefined values

### 4. Validation Before Response

Add validation before sending responses to ensure they match the expected format:

```python
def validate_metrics_response(response):
    required_fields = ["total", "change", "hourlyData", "directions"]
    for field in required_fields:
        if field not in response:
            add_default_value(response, field)
    return response
```

## Priority and Timeline

This should be treated as a high-priority task as it's causing the frontend dashboard to display errors for all metrics. Suggested timeline:

1. **Day 1-2**: Implement and test transformers for all endpoints
2. **Day 3**: Integration testing with frontend
3. **Day 4**: Deployment and verification
