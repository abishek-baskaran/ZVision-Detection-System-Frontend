import { render, screen, waitFor } from "../../utils/test-utils"
import FootfallMetrics from "@/components/dashboard/footfall-metrics"
import axios from "axios"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("FootfallMetrics Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows loading state initially", () => {
    // Mock axios to return a promise that doesn't resolve immediately
    mockedAxios.get.mockImplementationOnce(() => new Promise(() => {}))

    render(<FootfallMetrics timeRange="7d" />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("renders metrics data when loaded", async () => {
    // Mock successful API response
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total: 1248,
        change: 12.5,
        hourly: [
          { hour: "00:00", count: 12 },
          { hour: "04:00", count: 8 },
          { hour: "08:00", count: 45 },
          { hour: "12:00", count: 78 },
          { hour: "16:00", count: 65 },
          { hour: "20:00", count: 32 },
        ],
      },
    })

    render(<FootfallMetrics timeRange="7d" />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("1,248")).toBeInTheDocument()
    })

    // Check for the change percentage
    expect(screen.getByText(/12.5%/)).toBeInTheDocument()

    // Check that the chart is rendered
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument()
  })

  it("uses the correct timeRange parameter in API call", async () => {
    // Mock successful API response
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        total: 1248,
        change: 12.5,
        hourly: [],
      },
    })

    render(<FootfallMetrics timeRange="30d" />)

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/metrics?timeRange=30d")
    })
  })

  it("falls back to mock data if API fails", async () => {
    // Mock API failure
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"))

    render(<FootfallMetrics timeRange="7d" />)

    // Wait for the fallback data to be used
    await waitFor(() => {
      expect(screen.getByText("1,248")).toBeInTheDocument()
    })
  })
})

