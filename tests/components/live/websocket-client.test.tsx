import { render, screen, fireEvent, waitFor } from "../../utils/test-utils"
import WebSocketClient from "@/components/live/websocket-client"
import { act } from "react-dom/test-utils"

describe("WebSocketClient Component", () => {
  const mockOnMessage = jest.fn()
  const mockOnConnectionChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders in disconnected state initially", () => {
    render(<WebSocketClient onMessage={mockOnMessage} onConnectionChange={mockOnConnectionChange} />)

    expect(screen.getByText("Not connected")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /connect/i })).toBeInTheDocument()
  })

  it("shows connecting state when connect button is clicked", () => {
    render(<WebSocketClient onMessage={mockOnMessage} onConnectionChange={mockOnConnectionChange} />)

    // Click the connect button
    fireEvent.click(screen.getByRole("button", { name: /connect/i }))

    // Should show connecting state
    expect(screen.getByText("Connecting...")).toBeInTheDocument()
  })

  it("shows connected state after successful connection", async () => {
    render(<WebSocketClient onMessage={mockOnMessage} onConnectionChange={mockOnConnectionChange} />)

    // Click the connect button
    fireEvent.click(screen.getByRole("button", { name: /connect/i }))

    // Advance timers to simulate connection delay
    act(() => {
      jest.advanceTimersByTime(1500)
    })

    // Should show connected state
    await waitFor(() => {
      expect(screen.getByText("Connected to event stream")).toBeInTheDocument()
    })

    // Should call onConnectionChange with true
    expect(mockOnConnectionChange).toHaveBeenCalledWith(true)
  })

  it("disconnects when disconnect button is clicked", async () => {
    render(<WebSocketClient onMessage={mockOnMessage} onConnectionChange={mockOnConnectionChange} />)

    // Click the connect button
    fireEvent.click(screen.getByRole("button", { name: /connect/i }))

    // Advance timers to simulate connection delay
    act(() => {
      jest.advanceTimersByTime(1500)
    })

    // Should show connected state
    await waitFor(() => {
      expect(screen.getByText("Connected to event stream")).toBeInTheDocument()
    })

    // Click the disconnect button
    fireEvent.click(screen.getByRole("button", { name: /disconnect/i }))

    // Should show disconnected state
    expect(screen.getByText("Not connected")).toBeInTheDocument()

    // Should call onConnectionChange with false
    expect(mockOnConnectionChange).toHaveBeenCalledWith(false)
  })

  it("calls onMessage when messages are received", async () => {
    render(<WebSocketClient onMessage={mockOnMessage} onConnectionChange={mockOnConnectionChange} />)

    // Click the connect button
    fireEvent.click(screen.getByRole("button", { name: /connect/i }))

    // Advance timers to simulate connection delay
    act(() => {
      jest.advanceTimersByTime(1500)
    })

    // Should show connected state
    await waitFor(() => {
      expect(screen.getByText("Connected to event stream")).toBeInTheDocument()
    })

    // Advance timers to simulate message interval
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    // Should call onMessage with a mock event
    expect(mockOnMessage).toHaveBeenCalled()
    expect(mockOnMessage.mock.calls[0][0].data).toContain("detection")
  })
})

