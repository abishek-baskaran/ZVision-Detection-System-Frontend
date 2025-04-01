import { render, screen, act } from "../../utils/test-utils"
import DetectionIndicator from "@/components/live/detection-indicator"

describe("DetectionIndicator Component", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders with person detected message", () => {
    render(<DetectionIndicator />)

    expect(screen.getByText("Person Detected")).toBeInTheDocument()
  })

  it("renders with direction when provided", () => {
    render(<DetectionIndicator direction="LTR" />)

    expect(screen.getByText("Person Detected")).toBeInTheDocument()
    expect(screen.getByText("LTR")).toBeInTheDocument()
  })

  it("disappears after 5 seconds", () => {
    render(<DetectionIndicator />)

    // Initially visible
    expect(screen.getByText("Person Detected")).toBeInTheDocument()

    // Advance timers by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    // Should no longer be visible
    expect(screen.queryByText("Person Detected")).not.toBeInTheDocument()
  })

  it("reappears when timestamp changes", () => {
    const { rerender } = render(<DetectionIndicator timestamp="2023-04-07T12:34:56Z" />)

    // Initially visible
    expect(screen.getByText("Person Detected")).toBeInTheDocument()

    // Advance timers by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    // Should no longer be visible
    expect(screen.queryByText("Person Detected")).not.toBeInTheDocument()

    // Update the timestamp
    rerender(<DetectionIndicator timestamp="2023-04-07T12:35:00Z" />)

    // Should be visible again
    expect(screen.getByText("Person Detected")).toBeInTheDocument()
  })
})

