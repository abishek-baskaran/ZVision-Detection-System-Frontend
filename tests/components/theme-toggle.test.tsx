import { render, screen, fireEvent } from "../utils/test-utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

// Mock the useTheme hook
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}))

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    // Reset the mock before each test
    ;(useTheme as jest.Mock).mockReset()
  })

  it("renders correctly", () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: jest.fn(),
      resolvedTheme: "light",
    })

    render(<ThemeToggle />)
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("aria-label", "Switch to dark theme")
  })

  it("toggles from light to dark theme when clicked", () => {
    const setThemeMock = jest.fn()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: setThemeMock,
      resolvedTheme: "light",
    })

    render(<ThemeToggle />)
    const button = screen.getByRole("button")

    fireEvent.click(button)

    expect(setThemeMock).toHaveBeenCalledWith("dark")
  })

  it("toggles from dark to light theme when clicked", () => {
    const setThemeMock = jest.fn()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: setThemeMock,
      resolvedTheme: "dark",
    })

    render(<ThemeToggle />)
    const button = screen.getByRole("button")

    fireEvent.click(button)

    expect(setThemeMock).toHaveBeenCalledWith("light")
  })

  it("handles system theme correctly", () => {
    const setThemeMock = jest.fn()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: "system",
      setTheme: setThemeMock,
      resolvedTheme: "dark",
    })

    render(<ThemeToggle />)
    const button = screen.getByRole("button")

    fireEvent.click(button)

    expect(setThemeMock).toHaveBeenCalledWith("light")
  })
})

