# ZVision Frontend Project Overview

## Introduction

ZVision is a frontend application built with Next.js that provides a user interface for a detection system. Currently, the application uses mock data for development and testing purposes. This document provides an overview of the project structure and outlines the plan to replace mock data with real data from backend API endpoints.

## Project Structure

The project follows a standard Next.js application structure:

- `app/`: Contains the main application pages and API routes
  - `api/`: API routes for frontend-backend communication
  - `dashboard/`: Dashboard pages
  - `cameras/`: Camera management pages
  - `events/`: Event viewing pages
  - `live/`: Live monitoring pages
- `components/`: Reusable React components
  - `dashboard/`: Dashboard-specific components
- `lib/`: Utility functions and helpers
- `hooks/`: Custom React hooks
- `public/`: Static assets
- `styles/`: CSS and styling files
- `tests/`: Test files

## Current State

The application currently relies on mock data in several key areas:

1. **API Routes**: The Next.js API routes in `app/api/` are implemented with simulated delays and static mock data responses
2. **Components**: Several dashboard components include fallback mock data if API requests fail
3. **Tests**: Test files contain mock implementations for testing purposes

## Backend API Documentation

Two main documents describe the backend API implementation:

1. `app/api/api_guide.md`: Original API specification
2. `app/api/api_discrepencies.md`: Differences between the original specification and actual backend implementation

These documents will guide the process of replacing mock data with real backend API calls. 