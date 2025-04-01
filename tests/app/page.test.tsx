import { render, screen } from "../utils/test-utils"
import Home from "@/app/page"

describe("Home Page", () => {
  it("renders the hero section", () => {
    render(<Home />)

    expect(screen.getByText("Camera Analytics Dashboard")).toBeInTheDocument()
    expect(screen.getByText(/A modern application for camera management/i)).toBeInTheDocument()
  })

  it("renders the Get Started button", () => {
    render(<Home />)

    const getStartedButton = screen.getByRole("link", { name: /get started/i })
    expect(getStartedButton).toBeInTheDocument()
    expect(getStartedButton).toHaveAttribute("href", "/dashboard")
  })

  it("renders the Configure Cameras button", () => {
    render(<Home />)

    const configureCamerasButton = screen.getByRole("link", { name: /configure cameras/i })
    expect(configureCamerasButton).toBeInTheDocument()
    expect(configureCamerasButton).toHaveAttribute("href", "/cameras")
  })

  it("renders all feature cards", () => {
    render(<Home />)

    expect(screen.getByText("Camera Management")).toBeInTheDocument()
    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Events & Logs")).toBeInTheDocument()
    expect(screen.getByText("Live Monitoring")).toBeInTheDocument()
  })

  it("has links to all main sections", () => {
    render(<Home />)

    // Check that each feature card has a link to its respective page
    const links = screen.getAllByText("Explore")
    expect(links.length).toBe(4)

    // Check specific links
    expect(screen.getByText("Camera Management").closest("a")).toHaveAttribute("href", "/cameras")
    expect(screen.getByText("Analytics Dashboard").closest("a")).toHaveAttribute("href", "/dashboard")
    expect(screen.getByText("Events & Logs").closest("a")).toHaveAttribute("href", "/events")
    expect(screen.getByText("Live Monitoring").closest("a")).toHaveAttribute("href", "/live")
  })
})

