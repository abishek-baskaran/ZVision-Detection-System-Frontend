"use client"

import { render, screen, fireEvent, waitFor } from "../utils/test-utils"
import { DetectionToggle, CameraDetectionToggle } from "@/components/detection-toggle"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock useToast
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}))

describe("Detection Toggle Components", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useToast
    ;(useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    })
  })

  describe("DetectionToggle Component", () => {
    it("renders with default state (inactive)", () => {
      render(<DetectionToggle />)

      expect(screen.getByText("Detection Inactive")).toBeInTheDocument()
      expect(screen.getByRole("button")).toHaveTextContent("Detection Inactive")
    })

    it("renders with active state when initialState is true", () => {
      render(<DetectionToggle initialState={true} />)

      expect(screen.getByText("Detection Active")).toBeInTheDocument()
    })

    it("toggles state when clicked (inactive to active)", async () => {
      // Mock successful API response
      mockedAxios.post.mockResolvedValueOnce({ data: {} })

      const { toast } = useToast() as { toast: jest.Mock }

      render(<DetectionToggle />)

      // Click the toggle button
      fireEvent.click(screen.getByRole("button"))

      // Check for loading state
      expect(screen.getByText("Processing")).toBeInTheDocument()

      // Wait for the API call to complete
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith("/api/detection/start")
      })

      // Check that the state has changed
      expect(screen.getByText("Detection Active")).toBeInTheDocument()

      // Check that a success toast was shown
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Detection Started",
        }),
      )
    })

    it("toggles state when clicked (active to inactive)", async () => {
      // Mock successful API response
      mockedAxios.post.mockResolvedValueOnce({ data: {} })

      const { toast } = useToast() as { toast: jest.Mock }

      render(<DetectionToggle initialState={true} />)

      // Click the toggle button
      fireEvent.click(screen.getByRole("button"))

      // Wait for the API call to complete
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith("/api/detection/stop")
      })

      // Check that the state has changed
      expect(screen.getByText("Detection Inactive")).toBeInTheDocument()

      // Check that a success toast was shown
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Detection Stopped",
        }),
      )
    })

    it("shows error toast when API call fails", async () => {
      // Mock API failure
      mockedAxios.post.mockRejectedValueOnce(new Error("API error"))

      const { toast } = useToast() as { toast: jest.Mock }

      render(<DetectionToggle />)

      // Click the toggle button
      fireEvent.click(screen.getByRole("button"))

      // Wait for the error to be handled
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Error",
            variant: "destructive",
          }),
        )
      })
    })
  })

  describe("CameraDetectionToggle Component", () => {
    it("renders with default state (inactive)", () => {
      render(<CameraDetectionToggle cameraId="cam-001" />)

      expect(screen.getByText("Detection Off")).toBeInTheDocument()
    })

    it("renders with active state when initialState is true", () => {
      render(<CameraDetectionToggle cameraId="cam-001" initialState={true} />)

      expect(screen.getByText("Detection On")).toBeInTheDocument()
    })

    it("toggles state when clicked (inactive to active)", async () => {
      // Mock successful API response
      mockedAxios.put.mockResolvedValueOnce({ data: {} })

      const { toast } = useToast() as { toast: jest.Mock }

      render(<CameraDetectionToggle cameraId="cam-001" />)

      // Click the toggle button
      fireEvent.click(screen.getByRole("button"))

      // Wait for the API call to complete
      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith("/api/cameras/cam-001", {
          detection_enabled: true,
        })
      })

      // Check that the state has changed
      expect(screen.getByText("Detection On")).toBeInTheDocument()

      // Check that a success toast was shown
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Detection Enabled",
        }),
      )
    })

    it("toggles state when clicked (active to inactive)", async () => {
      // Mock successful API response
      mockedAxios.put.mockResolvedValueOnce({ data: {} })

      const { toast } = useToast() as { toast: jest.Mock }

      render(<CameraDetectionToggle cameraId="cam-001" initialState={true} />)

      // Click the toggle button
      fireEvent.click(screen.getByRole("button"))

      // Wait for the API call to complete
      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith("/api/cameras/cam-001", {
          detection_enabled: false,
        })
      })

      // Check that the state has changed
      expect(screen.getByText("Detection Off")).toBeInTheDocument()

      // Check that a success toast was shown
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Detection Disabled",
        }),
      )
    })

    it("shows error toast when API call fails", async () => {
      // Mock API failure
      mockedAxios.put.mockRejectedValueOnce(new Error("API error"))

      const { toast } = useToast() as { toast: jest.Mock }

      render(<CameraDetectionToggle cameraId="cam-001" />)

      // Click the toggle button
      fireEvent.click(screen.getByRole("button"))

      // Wait for the error to be handled
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Error",
            variant: "destructive",
          }),
        )
      })
    })
  })
})

