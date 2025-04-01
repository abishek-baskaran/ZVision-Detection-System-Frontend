import { render, screen, fireEvent } from "../../utils/test-utils"
import DashboardPage from "@/app/dashboard/page"

describe("Dashboard Page", () => {
  it("renders the page title", () => {
    render(<DashboardPage />)

    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument()
  })

  it("renders the time range selector", () => {
    render(<DashboardPage />)

    expect(screen.getByText("Time Range:")).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("renders all metric components", () => {
    render(<DashboardPage />)

    // Check for the main metric components
    expect(screen.getByText("Hourly Traffic")).toBeInTheDocument()
    expect(screen.getByText("Daily Traffic")).toBeInTheDocument()

    // Check for the tabs
    expect(screen.getByRole("tab", { name: /camera comparison/i })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /trend analysis/i })).toBeInTheDocument()
  })

  it("changes time range when selector is changed", () => {
    render(<DashboardPage />)

    // Open the time range selector
    fireEvent.click(screen.getByRole("combobox"))

    // Select a different time range
    fireEvent.click(screen.getByRole("option", { name: /last 30 days/i }))

    // Check that the time range has been updated in the UI
    expect(screen.getByRole("combobox")).toHaveTextContent("Last 30 Days")
  })

  it("switches between tabs when clicked", () => {
    render(<DashboardPage />)

    // Camera Comparison tab should be active by default
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Camera Comparison")

    // Click on the Trend Analysis tab
    fireEvent.click(screen.getByRole("tab", { name: /trend analysis/i }))

    // Trend Analysis tab should now be active
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Trend Analysis")
  })
})

