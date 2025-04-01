import { render, screen } from "../../utils/test-utils"
import { Card } from "@/components/ui/card"

describe("Card Component", () => {
  it("renders correctly with children", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>,
    )

    expect(screen.getByText("Card Content")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(
      <Card className="custom-class">
        <div>Card Content</div>
      </Card>,
    )

    const card = screen.getByText("Card Content").parentElement
    expect(card).toHaveClass("custom-class")
  })

  it("forwards additional props to the element", () => {
    render(
      <Card data-testid="test-card">
        <div>Card Content</div>
      </Card>,
    )

    expect(screen.getByTestId("test-card")).toBeInTheDocument()
  })
})

