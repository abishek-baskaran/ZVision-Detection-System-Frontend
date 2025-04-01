import { render, screen } from "../../utils/test-utils"
import { Button } from "@/components/ui/button"
import { describe, it, expect } from "vitest"

describe("Button Component", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("inline-flex")
  })

  it("renders with different variants", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button", { name: /delete/i })
    expect(button).toHaveClass("bg-destructive")
  })

  it("renders with different sizes", () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole("button", { name: /small button/i })
    expect(button).toHaveClass("h-9")
  })

  it("renders as a child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>,
    )
    const link = screen.getByRole("link", { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "#")
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole("button", { name: /disabled button/i })
    expect(button).toBeDisabled()
  })
})

