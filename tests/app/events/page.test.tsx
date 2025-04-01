"use client"

import { render, screen, fireEvent, waitFor } from "../../utils/test-utils"
import EventsPage from "@/app/events/page"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock useToast
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}))

describe("Events Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useToast
    ;(useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    })

    // Mock API responses
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/api/events")) {
        return Promise.resolve({
          data: [
            {
              id: "evt-001",
              timestamp: "2023-04-07T08:23:15Z",
              event_type: "system",
              message: "System started",
            },
            {
              id: "evt-002",
              timestamp: "2023-04-07T09:15:22Z",
              event_type: "error",
              message: "Connection lost to camera cam-002",
              camera_id: "cam-002",
            },
          ],
        })
      } else if (url.includes("/api/detections/recent")) {
        return Promise.resolve({
          data: [
            {
              id: "det-001",
              timestamp: "2023-04-07T08:30:15Z",
              camera_id: "cam-001",
              direction: "LTR",
              confidence: 0.92,
              snapshot_path: "/snapshots/det-001.jpg",
            },
          ],
        })
      }
      return Promise.reject(new Error("Unknown URL"))
    })
  })

  it("renders the page title", () => {
    render(<EventsPage />)

    expect(screen.getByText("Events & Logs")).toBeInTheDocument()
  })

  it("shows loading state initially", () => {
    render(<EventsPage />)

    // Check for loading indicators
    expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0)
  })

  it("renders events when loaded", async () => {
    render(<EventsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("System started")).toBeInTheDocument()
      expect(screen.getByText("Connection lost to camera cam-002")).toBeInTheDocument()
    })
  })

  it("renders detections when loaded", async () => {
    render(<EventsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText(/detection on camera cam-001/i)).toBeInTheDocument()
    })
  })

  it("switches between tabs when clicked", async () => {
    render(<EventsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    // All Events tab should be active by default
    expect(screen.getByText("System started")).toBeInTheDocument()
    expect(screen.getByText(/detection on camera cam-001/i)).toBeInTheDocument()

    // Click on the Detections tab
    fireEvent.click(screen.getByRole("tab", { name: /detections/i }))

    // Only detection events should be visible
    expect(screen.queryByText("System started")).not.toBeInTheDocument()
    expect(screen.getByText(/detection on camera cam-001/i)).toBeInTheDocument()

    // Click on the System Events tab
    fireEvent.click(screen.getByRole("tab", { name: /system events/i }))

    // Only system events should be visible
    expect(screen.getByText("System started")).toBeInTheDocument()
    expect(screen.queryByText(/detection on camera cam-001/i)).not.toBeInTheDocument()
  })

  it("toggles filters when filter button is clicked", async () => {
    render(<EventsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    // Filters should be hidden initially
    expect(screen.queryByText(/event types/i)).not.toBeInTheDocument()

    // Click the filter button
    fireEvent.click(screen.getByRole("button", { name: /filters/i }))

    // Filters should now be visible
    expect(screen.getByText(/event types/i)).toBeInTheDocument()

    // Click the filter button again
    fireEvent.click(screen.getByRole("button", { name: /filters/i }))

    // Filters should be hidden again
    await waitFor(() => {
      expect(screen.queryByText(/event types/i)).not.toBeInTheDocument()
    })
  })

  it("applies event type filters", async () => {
    render(<EventsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    // Show filters
    fireEvent.click(screen.getByRole("button", { name: /filters/i }))

    // Select the Error filter
    fireEvent.click(screen.getByText("Error"))

    // API should be called with the selected filter
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("types=error"))
  })
})

