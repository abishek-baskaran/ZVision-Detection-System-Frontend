"use client"

import { render, screen, fireEvent, waitFor } from "../../../utils/test-utils"
import CameraDetailsPage from "@/app/cameras/[id]/page"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useParams, useRouter } from "next/navigation"

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock useToast
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}))

// Mock useParams and useRouter
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(),
  useRouter: jest.fn(),
}))

describe("Camera Details Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useToast
    ;(useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    })

    // Mock useParams
    ;(useParams as jest.Mock).mockReturnValue({
      id: "cam-001",
    })

    // Mock useRouter
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    })

    // Mock API responses
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: "cam-001",
        name: "Front Door",
        source: "rtsp://192.168.1.100:554/stream1",
        active: true,
        detection_enabled: true,
        roi: {
          x: 50,
          y: 100,
          width: 200,
          height: 150,
        },
        entry_direction: "LTR",
      },
    })
  })

  it("shows loading state initially", () => {
    render(<CameraDetailsPage />)

    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("renders camera details when loaded", async () => {
    render(<CameraDetailsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
    })

    // Check for camera details
    expect(screen.getByText("rtsp://192.168.1.100:554/stream1")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()

    // Check for ROI details
    expect(screen.getByText("X: 50")).toBeInTheDocument()
    expect(screen.getByText("Y: 100")).toBeInTheDocument()
    expect(screen.getByText("Width: 200")).toBeInTheDocument()
    expect(screen.getByText("Height: 150")).toBeInTheDocument()

    // Check for entry direction
    expect(screen.getByText("LTR")).toBeInTheDocument()
  })

  it("shows error message when camera is not found", async () => {
    // Mock API failure
    mockedAxios.get.mockReset()
    mockedAxios.get.mockRejectedValueOnce(new Error("Camera not found"))

    render(<CameraDetailsPage />)

    // Wait for the error to be handled
    await waitFor(() => {
      expect(screen.getByText(/camera not found/i)).toBeInTheDocument()
    })
  })

  it("has a back button to return to cameras page", async () => {
    render(<CameraDetailsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
    })

    // Check for back button
    const backButton = screen.getByText("Back to Cameras")
    expect(backButton).toBeInTheDocument()
    expect(backButton.closest("a")).toHaveAttribute("href", "/cameras")
  })

  it("has ROI selector component", async () => {
    render(<CameraDetailsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
    })

    // Check for ROI selector
    expect(screen.getByText("Configure Region of Interest")).toBeInTheDocument()
    expect(screen.getByText("Draw a rectangle to select the Region of Interest")).toBeInTheDocument()
  })

  it("has entry direction radio buttons", async () => {
    render(<CameraDetailsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
    })

    // Check for entry direction radio buttons
    expect(screen.getByText("Entry Direction")).toBeInTheDocument()
    expect(screen.getByLabelText("Left to Right")).toBeInTheDocument()
    expect(screen.getByLabelText("Right to Left")).toBeInTheDocument()

    // LTR should be selected by default based on the mock data
    expect(screen.getByLabelText("Left to Right")).toBeChecked()
  })

  it("saves ROI configuration when save button is clicked", async () => {
    // Mock the post API call
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: "cam-001",
        roi: {
          x: 50,
          y: 100,
          width: 200,
          height: 150,
        },
        entry_direction: "LTR",
      },
    })

    const { toast } = useToast() as { toast: jest.Mock }

    render(<CameraDetailsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
    })

    // Click the save button
    fireEvent.click(screen.getByRole("button", { name: /save configuration/i }))

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/cameras/cam-001/roi", {
        roi: {
          x: 50,
          y: 100,
          width: 200,
          height: 150,
        },
        entry_direction: "LTR",
      })
    })

    // Check that a success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success",
      }),
    )
  })

  it("clears ROI when clear button is clicked", async () => {
    // Mock the post API call
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: "cam-001",
      },
    })

    const { toast } = useToast() as { toast: jest.Mock }

    render(<CameraDetailsPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
    })

    // Click the clear button
    fireEvent.click(screen.getByRole("button", { name: /clear roi/i }))

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/cameras/cam-001/roi/clear")
    })

    // Check that a success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success",
      }),
    )
  })
})

