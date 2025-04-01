import { render, screen, fireEvent, waitFor } from "../../utils/test-utils"
import AddCameraForm from "@/components/cameras/add-camera-form"

describe("AddCameraForm Component", () => {
  const mockOnAddCamera = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form with all required fields", () => {
    render(<AddCameraForm onAddCamera={mockOnAddCamera} />)

    expect(screen.getByLabelText(/camera id/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/camera name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/source url/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add camera/i })).toBeInTheDocument()
  })

  it("validates required fields", async () => {
    render(<AddCameraForm onAddCamera={mockOnAddCamera} />)

    // Submit the form without filling any fields
    const submitButton = screen.getByRole("button", { name: /add camera/i })
    fireEvent.click(submitButton)

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/id is required/i)).toBeInTheDocument()
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/source is required/i)).toBeInTheDocument()
    })

    expect(mockOnAddCamera).not.toHaveBeenCalled()
  })

  it("submits the form with valid data", async () => {
    render(<AddCameraForm onAddCamera={mockOnAddCamera} />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/camera id/i), { target: { value: "cam-006" } })
    fireEvent.change(screen.getByLabelText(/camera name/i), { target: { value: "Backyard" } })
    fireEvent.change(screen.getByLabelText(/source url/i), { target: { value: "rtsp://example.com/stream" } })

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add camera/i })
    fireEvent.click(submitButton)

    // Check if onAddCamera was called with the correct data
    await waitFor(() => {
      expect(mockOnAddCamera).toHaveBeenCalledWith({
        id: "cam-006",
        name: "Backyard",
        source: "rtsp://example.com/stream",
      })
    })
  })

  it("shows loading state during submission", async () => {
    // Mock the onAddCamera function to return a promise that doesn't resolve immediately
    const delayedMockOnAddCamera = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)))

    render(<AddCameraForm onAddCamera={delayedMockOnAddCamera} />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/camera id/i), { target: { value: "cam-006" } })
    fireEvent.change(screen.getByLabelText(/camera name/i), { target: { value: "Backyard" } })
    fireEvent.change(screen.getByLabelText(/source url/i), { target: { value: "rtsp://example.com/stream" } })

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add camera/i })
    fireEvent.click(submitButton)

    // Check for loading state
    expect(screen.getByText(/adding.../i)).toBeInTheDocument()

    // Wait for the submission to complete
    await waitFor(() => {
      expect(delayedMockOnAddCamera).toHaveBeenCalled()
    })
  })
})

