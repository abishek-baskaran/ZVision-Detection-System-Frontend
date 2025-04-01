"use client"

import { render, screen, waitFor, fireEvent } from "../../utils/test-utils"
import CamerasPage from "@/app/cameras/page"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock useToast
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}))

describe("Cameras Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useToast
    ;(useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    })
  })

  it("shows loading state initially", () => {
    // Mock axios to return a promise that doesn't resolve immediately
    mockedAxios.get.mockImplementationOnce(() => new Promise(() => {}))

    render(<CamerasPage />)

    expect(screen.getByText(/loading cameras/i)).toBeInTheDocument()
  })

  it("renders camera list when loaded", async () => {
    // Mock successful API response
    mockedAxios.get.mockResolvedValueOnce({
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

    render(<CamerasPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
      expect(screen.getByText("Backyard")).toBeInTheDocument()
    })
  })

  it("shows error message when API fails", async () => {
    // Mock API failure
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"))

    const { toast } = useToast() as { toast: jest.Mock }

    render(<CamerasPage />)

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

  it("adds a new camera when form is submitted", async () => {
    // Mock API responses
    mockedAxios.get.mockResolvedValueOnce({ data: [] })
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: "cam-006",
        name: "New Camera",
        source: "rtsp://example.com/stream",
        active: true,
      },
    })

    const { toast } = useToast() as { toast: jest.Mock }

    render(<CamerasPage />)

    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading cameras/i)).not.toBeInTheDocument()
    })

    // Fill in the add camera form
    fireEvent.change(screen.getByLabelText(/camera id/i), { target: { value: "cam-006" } })
    fireEvent.change(screen.getByLabelText(/camera name/i), { target: { value: "New Camera" } })
    fireEvent.change(screen.getByLabelText(/source url/i), { target: { value: "rtsp://example.com/stream" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add camera/i }))

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/cameras", {
        id: "cam-006",
        name: "New Camera",
        source: "rtsp://example.com/stream",
      })
    })

    // Check that a success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success",
      }),
    )
  })

  it("removes a camera when remove button is clicked and confirmed", async () => {
    // Mock API responses
    mockedAxios.get.mockResolvedValueOnce({
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
    mockedAxios.delete.mockResolvedValueOnce({ data: {} })

    const { toast } = useToast() as { toast: jest.Mock }

    render(<CamerasPage />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Front Door")).toBeInTheDocument()
    })

    // Click the remove button
    fireEvent.click(screen.getByRole("button", { name: /remove/i }))

    // Confirm the removal
    fireEvent.click(screen.getByRole("button", { name: /remove$/i }))

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith("/api/cameras/cam-001")
    })

    // Check that a success toast was shown
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success",
      }),
    )
  })
})

