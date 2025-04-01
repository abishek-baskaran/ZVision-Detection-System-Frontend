import { render, screen, fireEvent } from "../utils/test-utils"
import Navbar from "@/components/navbar"
import { usePathname } from "next/navigation"

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  usePathname: jest.fn(),
}))

describe("Navbar Component", () => {
  beforeEach(() => {
    // Reset the mock before each test
    ;(usePathname as jest.Mock).mockReset()
    ;(usePathname as jest.Mock).mockReturnValue("/")
  })

  it("renders the logo and navigation items", () => {
    render(<Navbar />)

    // Check for logo
    expect(screen.getByText("CamAnalytics")).toBeInTheDocument()

    // Check for navigation items
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Cameras")).toBeInTheDocument()
    expect(screen.getByText("Events")).toBeInTheDocument()
    expect(screen.getByText("Live View")).toBeInTheDocument()
  })

  it("highlights the active navigation item", () => {
    ;(usePathname as jest.Mock).mockReturnValue("/dashboard")

    render(<Navbar />)

    // The Dashboard link should have the active class
    const dashboardLink = screen.getByText("Dashboard").closest("a")
    expect(dashboardLink).toHaveClass("text-primary")
  })

  it("toggles the mobile menu when the menu button is clicked", () => {
    render(<Navbar />)

    // Mobile menu should be closed initially
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    // Click the menu button
    const menuButton = screen.getByRole("button", { name: /toggle menu/i })
    fireEvent.click(menuButton)

    // Mobile menu should now be open
    // Note: Since we're mocking framer-motion, we need to check for the content instead
    expect(screen.getAllByText("Home").length).toBeGreaterThan(1)
  })

  it("includes the theme toggle button", () => {
    render(<Navbar />)

    // Check for the theme toggle button
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument()
  })

  it("includes the detection toggle button", () => {
    render(<Navbar />)

    // Check for the detection toggle button (might be hidden on mobile)
    const detectionToggleText = screen.queryByText(/detection (active|inactive)/i)
    expect(detectionToggleText).toBeInTheDocument()
  })
})

