import { render, screen, fireEvent } from "../../utils/test-utils"
import { Switch } from "@/components/ui/switch"

describe("Switch Component", () => {
  it("renders correctly", () => {
    render(<Switch />)
    const switchElement = screen.getByRole("switch")
    expect(switchElement).toBeInTheDocument()
  })

  it("is unchecked by default", () => {
    render(<Switch />)
    const switchElement = screen.getByRole("switch")
    expect(switchElement).not.toBeChecked()
  })

  it("can be checked", () => {
    render(<Switch checked />)
    const switchElement = screen.getByRole("switch")
    expect(switchElement).toBeChecked()
  })

  it("calls onCheckedChange when clicked", () => {
    const handleChange = jest.fn()
    render(<Switch onCheckedChange={handleChange} />)

    const switchElement = screen.getByRole("switch")
    fireEvent.click(switchElement)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it("can be disabled", () => {
    render(<Switch disabled />)
    const switchElement = screen.getByRole("switch")
    expect(switchElement).toBeDisabled()
  })

  it("applies custom className", () => {
    render(<Switch className="custom-class" />)
    const switchElement = screen.getByRole("switch")
    expect(switchElement).toHaveClass("custom-class")
  })
})

