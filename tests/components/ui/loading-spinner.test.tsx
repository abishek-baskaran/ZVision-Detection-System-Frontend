import { render, screen } from "../../utils/test-utils"
import { LoadingSpinner, LoadingDots, LoadingCard, LoadingOverlay } from "@/components/ui/loading-spinner"
import { describe, it, expect } from "vitest"

describe("Loading Components", () => {
  describe("LoadingSpinner Component", () => {
    it("renders with default props", () => {
      render(<LoadingSpinner />)

      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("renders with custom text", () => {
      render(<LoadingSpinner text="Please wait" />)

      expect(screen.getByText("Please wait")).toBeInTheDocument()
    })

    it("renders with different sizes", () => {
      const { rerender } = render(<LoadingSpinner size="sm" />)

      // Small size
      expect(screen.getByText("Loading...")).toBeInTheDocument()

      // Medium size (default)
      rerender(<LoadingSpinner size="md" />)
      expect(screen.getByText("Loading...")).toBeInTheDocument()

      // Large size
      rerender(<LoadingSpinner size="lg" />)
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("applies custom className", () => {
      render(<LoadingSpinner className="custom-class" />)

      const container = screen.getByText("Loading...").parentElement
      expect(container).toHaveClass("custom-class")
    })
  })

  describe("LoadingDots Component", () => {
    it("renders correctly", () => {
      render(<LoadingDots />)

      // Check that the container is rendered
      const container = screen.getByRole("generic")
      expect(container).toHaveClass("flex")
    })

    it("applies custom className", () => {
      render(<LoadingDots className="custom-class" />)

      const container = screen.getByRole("generic")
      expect(container).toHaveClass("custom-class")
    })
  })

  describe("LoadingCard Component", () => {
    it("renders with default height", () => {
      render(<LoadingCard />)

      const card = screen.getByText("Loading...").closest("div")
      expect(card).toHaveClass("h-64")
    })

    it("renders with custom height", () => {
      render(<LoadingCard height="h-40" />)

      const card = screen.getByText("Loading...").closest("div")
      expect(card).toHaveClass("h-40")
    })

    it("applies custom className", () => {
      render(<LoadingCard className="custom-class" />)

      const card = screen.getByText("Loading...").closest("div")
      expect(card).toHaveClass("custom-class")
    })
  })

  describe("LoadingOverlay Component", () => {
    it("renders with default text", () => {
      render(<LoadingOverlay />)

      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("renders with custom text", () => {
      render(<LoadingOverlay text="Processing..." />)

      expect(screen.getByText("Processing...")).toBeInTheDocument()
    })

    it("applies custom className", () => {
      render(<LoadingOverlay className="custom-class" />)

      const overlay = screen.getByText("Loading...").closest("div")
      expect(overlay).toHaveClass("custom-class")
    })
  })
})

