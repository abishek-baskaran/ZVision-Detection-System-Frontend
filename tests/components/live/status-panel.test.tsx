import { render, screen, fireEvent } from "../../utils/test-utils"
import StatusPanel from "@/components/live/status-panel"

describe("StatusPanel Component", () => {
  const mockCamera = {
    id: "cam-001",
    name: "Front Door",
    source: "rtsp://192.168.1.100:554/stream1",
    active: true,
    detection_enabled: true,
  }

  const mockStatus = {
    detection_active: true,
    person_detected: false,
  }

  const mockOnDetectionToggle = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders camera information correctly", () => {
    render(<StatusPanel camera={mockCamera} status={mockStatus} onDetectionToggle={mockOnDetectionToggle} />)

    expect(screen.getByText("Camera Status")).toBeInTheDocument()
    expect(screen.getByText("Front Door")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()
    expect(screen.getByText("Detection Enabled")).toBeInTheDocument()
    expect(screen.getByText("System Active")).toBeInTheDocument()
    expect(screen.getByText("Person Not Detected")).toBeInTheDocument()
  })

  it("renders a message when no camera is selected", () => {
    render(<StatusPanel camera={undefined} status={mockStatus} onDetectionToggle={mockOnDetectionToggle} />)

    expect(screen.getByText("No camera selected")).toBeInTheDocument()
  })

  it("shows person detected status when a person is detected", () => {
    const statusWithDetection = {
      ...mockStatus,
      person_detected: true,
      last_detection_time: "2023-04-07T12:34:56Z",
      direction: "LTR",
    }

    render(<StatusPanel camera={mockCamera} status={statusWithDetection} onDetectionToggle={mockOnDetectionToggle} />)

    expect(screen.getByText("Person Detected")).toBeInTheDocument()
    expect(screen.getByText("Direction: LTR")).toBeInTheDocument()
    expect(screen.getByText("Last Detection:")).toBeInTheDocument()
    expect(screen.getByText("Jan 1, 2023")).toBeInTheDocument() // From our mocked date-fns
  })

  it("calls onDetectionToggle when the detection switch is toggled", () => {
    render(<StatusPanel camera={mockCamera} status={mockStatus} onDetectionToggle={mockOnDetectionToggle} />)

    // Find the switch
    const switchElement = screen.getByRole("switch")

    // Toggle the switch
    fireEvent.click(switchElement)

    // Check that onDetectionToggle was called with the correct arguments
    expect(mockOnDetectionToggle).toHaveBeenCalledWith("cam-001", false)
  })

  it("disables the detection toggle when camera is inactive", () => {
    const inactiveCamera = {
      ...mockCamera,
      active: false,
    }

    render(<StatusPanel camera={inactiveCamera} status={mockStatus} onDetectionToggle={mockOnDetectionToggle} />)

    // Find the switch
    const switchElement = screen.getByRole("switch")

    // Check that it's disabled
    expect(switchElement).toBeDisabled()
  })

  it("disables the View Detection History button when camera is inactive", () => {
    const inactiveCamera = {
      ...mockCamera,
      active: false,
    }

    render(<StatusPanel camera={inactiveCamera} status={mockStatus} onDetectionToggle={mockOnDetectionToggle} />)

    // Find the button
    const button = screen.getByRole("button", { name: /view detection history/i })

    // Check that it's disabled
    expect(button).toBeDisabled()
  })
})

