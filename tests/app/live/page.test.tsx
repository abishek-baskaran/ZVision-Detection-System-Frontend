"use client"

import { render, screen, fireEvent, waitFor } from "../../utils/test-utils"
import LivePage from "@/app/live/page"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock useToast
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}))

// Mock useSearchParams
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(),
}))

describe("Live Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useToast
    ;(useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    })

    // Mock useSearchParams
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("cam-001"),
    })

    // Mock API responses
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/api/cameras")) {
        return Promise.resolve({
          data: [
            {
              id: "cam-001",
              name: "Front Door",
              source: "rtsp://192.168.1.100:554/stream1",
              active: true,
              detection_enabled: true,
            },
            {
              id: "cam-002",
              name: "Backyard",
              source: "rtsp://192.168.1.101:554/stream1",
              active: false,
              detection_enabled: false,
            },
          ],
        })
      } else if (url.includes("/api/status")) {
        return Promise.resolve({
          data: {
            detection_active: true,
            person_detected: false,
          },
        })
      }
      return Promise.reject(new Error("Unknown URL"))
    })

    // Mock setInterval and clearInterval
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders the page title", () => {
    render(<LivePage />)

    expect(screen.getByText("Live Camera View")).toBeInTheDocument()
  })

  it("shows loading state initially", () => {
    render(<LivePage />)

    expect(screen.getByText(/loading camera feed/i)).toBeInTheDocument()
  })

  it("renders camera feed when loaded", async () => {
    render(<LivePage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading camera feed/i)).not.toBeInTheDocument()
    })

    // Check for camera name in the UI
    expect(screen.getByText("Front Door")).toBeInTheDocument()
  })

  it("shows camera status panel", async () => {
    render(<LivePage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading camera feed/i)).not.toBeInTheDocument()
    })

    // Check for status panel elements
    expect(screen.getByText("Camera Status")).toBeInTheDocument()
    expect(screen.getByText(/detection (enabled|disabled)/i)).toBeInTheDocument()
  })

  it("changes camera when selector is changed", async () => {
    render(<LivePage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading camera feed/i)).not.toBeInTheDocument()
    })

    // Open the camera selector
    fireEvent.click(screen.getByRole("combobox"))

    // Select a different camera
    fireEvent.click(screen.getByRole("option", { name: /backyard/i }))

    // API should be called with the new camera ID
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/status?camera_id=cam-002")
  })

  it("toggles settings panel when settings button is clicked", async () => {
    render(<LivePage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading camera feed/i)).not.toBeInTheDocument()
    })

    // Settings panel should be hidden initially
    expect(screen.queryByText("Settings")).not.toBeInTheDocument()

    // Click the settings button
    fireEvent.click(screen.getByRole("button", { name: /settings/i }))

    // Settings panel should now be visible
    expect(screen.getByText("Settings")).toBeInTheDocument()

    // Click the settings button again
    fireEvent.click(screen.getByRole("button", { name: /settings/i }))

    // Settings panel should be hidden again
    await waitFor(() => {
      expect(screen.queryByText("Settings")).not.toBeInTheDocument()
    })
  })

  it("shows detection indicator when person is detected", async () => {
    // Mock status API to indicate a person is detected
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/api/cameras")) {
        return Promise.resolve({
          data: [
            {
              id: "cam-001",
              name: "Front Door",
              source: "rtsp://192.168.1.100:554/stream1",
              active: true,
              detection_enabled: true,
            },
          ],
        })
      } else if (url.includes("/api/status")) {
        return Promise.resolve({
          data: {
            detection_active: true,
            person_detected: true,
            last_detection_time: "2023-04-07T12:34:56Z",
            camera_id: "cam-001",
            direction: "LTR",
          },
        })
      }
      return Promise.reject(new Error("Unknown URL"))
    })

    render(<LivePage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading camera feed/i)).not.toBeInTheDocument()
    })

    // Check for detection indicator
    expect(screen.getByText("Person Detected")).toBeInTheDocument()
    expect(screen.getByText("LTR")).toBeInTheDocument()
  })
})

