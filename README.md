# Camera Analytics Dashboard

A Next.js application for camera management, detection configuration, analytics visualization, and real-time monitoring with a modern 2.5D/glassmorphism UI.

## Features

### Camera Management
- View a list of all cameras with status indicators
- Add new cameras with name, ID, and source URL
- Remove cameras from the system
- Toggle camera activation status
- Configure Region of Interest (ROI) for each camera
- Set entry direction (Left to Right or Right to Left)
- Enable/disable detection for individual cameras
- Global detection toggle for all cameras

### Analytics Dashboard
- Real-time metrics for footfall and direction analysis
- Hourly and daily traffic patterns visualization
- Camera comparison tools
- Time range filtering (24h, 7d, 30d, 90d)
- Summary statistics with peak hours and daily averages

### Events & Logs
- View system events and detection logs
- Filter events by date range and event type
- View detection snapshots with details
- Tabbed interface for all events, detections, and system events
- Real-time event monitoring

### Live Camera View
- Real-time video feed display with 2.5D styling
- Camera selector to switch between feeds
- Status panel showing camera information and detection status
- Detection indicators for person detection events
- Optional WebSocket integration for real-time updates
- Settings panel for video quality and display options

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Hooks
- **Data Visualization**: Recharts
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Animation**: Framer Motion

## Project Structure

