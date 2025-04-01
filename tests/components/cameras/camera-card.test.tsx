import { render, screen, fireEvent } from "../../utils/test-utils"
import CameraCard from "@/components/cameras/camera-card"

describe("CameraCard Component", () => {
  const mockCamera = {
    id: "cam-001",
    name: "Front Door",
    source: "rtsp://192.168.1.100:554/stream1",
    active: true,
    detection_enabled: true,
  }

  const mockOnRemove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders camera information correctly", () => {
    render(<CameraCard camera={mockCamera} onRemove={mockOnRemove} />)

    expect(screen.getByText("Front Door")).toBeInTheDocument()
    expect(screen.getByText("rtsp://192.168.1.100:554/stream1")).toBeInTheDocument()
    expect(screen.getByText("ID: cam-001")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
  })

  it("shows inactive status when camera is not active", () => {
    const inactiveCamera = { ...mockCamera, active: false }
    render(<CameraCard camera={inactiveCamera} onRemove={mockOnRemove} />)

    expect(screen.getByText("Inactive")).toBeInTheDocument()
  })

  it("calls onRemove when remove button is clicked and confirmed", () => {
    render(<CameraCard camera={mockCamera} onRemove={mockOnRemove} />)

    // Open the alert dialog
    const removeButton = screen.getByRole("button", { name: /remove/i })
    fireEvent.click(removeButton)

    // Confirm the removal
    const confirmButton = screen.getByRole("button", { name: /remove$/i })
    fireEvent.click(confirmButton)

    expect(mockOnRemove).toHaveBeenCalledWith("cam-001")
  })

  it("does not call onRemove when removal is canceled", () => {
    render(<CameraCard camera={mockCamera} onRemove={mockOnRemove} />)

    // Open the alert dialog
    const removeButton = screen.getByRole("button", { name: /remove/i })
    fireEvent.click(removeButton)

    // Cancel the removal
    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnRemove).not.toHaveBeenCalled()
  })

  it("has a link to the camera details page", () => {
    render(<CameraCard camera={mockCamera} onRemove={mockOnRemove} />)

    const settingsButton = screen.getByRole("button", { name: /settings/i })
    expect(settingsButton.closest("a")).toHaveAttribute("href", "/cameras/cam-001")
  })

  it("has a detection toggle button", () => {
    render(<CameraCard camera={mockCamera} onRemove={mockOnRemove} />)

    // Check for the detection toggle component
    // This is a bit tricky since it's a custom component, but we can check for its text
    const detectionToggle = screen.getByText(/detection (on|off)/i)
    expect(detectionToggle).toBeInTheDocument()
  })
})

