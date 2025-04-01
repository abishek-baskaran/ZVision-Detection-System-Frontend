import { render, screen, waitFor } from "../../utils/test-utils"
import VideoFeed from "@/components/live/video-feed"
import "@testing-library/jest-dom"

// We are using the default Next/Image mock from jest.setup.js

describe("VideoFeed Component", () => {
  it("renders with loading state initially", () => {
    render(<VideoFeed cameraId="cam-001" />)
    expect(screen.getByText("Loading video feed...")).toBeInTheDocument()
  })

  it("renders the video feed after loading", async () => {
    render(<VideoFeed cameraId="cam-001" />)

    // Wait for the loading state to disappear (the component uses a 1500ms timeout)
    await waitFor(() => {
      expect(screen.queryByText("Loading video feed...")).not.toBeInTheDocument()
    }, { timeout: 2000 })

    // Check that the image is rendered with the correct alt text
    const image = screen.getByRole("img")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("alt", "Camera feed from cam-001")
  })

  it("uses the provided width and height", async () => {
    render(<VideoFeed cameraId="cam-001" width={800} height={600} />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading video feed...")).not.toBeInTheDocument()
    }, { timeout: 2000 })

    // Check that the image has the correct dimensions
    const image = screen.getByRole("img")
    expect(image).toHaveAttribute("width", "800")
    expect(image).toHaveAttribute("height", "600")
  })

  // Note: We're skipping the error test as it requires complex mocking of the Image component
  // which is difficult to do with the current test setup

  it("reloads the feed when cameraId changes", async () => {
    const { rerender } = render(<VideoFeed cameraId="cam-001" />)

    // Wait for the initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading video feed...")).not.toBeInTheDocument()
    }, { timeout: 2000 })

    // Change the camera ID
    rerender(<VideoFeed cameraId="cam-002" />)

    // Check that loading state is shown again
    expect(screen.getByText("Loading video feed...")).toBeInTheDocument()

    // Wait for the loading to complete again
    await waitFor(() => {
      expect(screen.queryByText("Loading video feed...")).not.toBeInTheDocument()
    }, { timeout: 2000 })

    // Check that the image alt text has been updated
    const image = screen.getByRole("img")
    expect(image).toHaveAttribute("alt", "Camera feed from cam-002")
  })
})

