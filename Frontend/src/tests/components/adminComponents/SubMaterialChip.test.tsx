import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SubMaterialChip from "../../../components/adminComponents/SubMaterialChip";

describe("SubMaterialChip", () => {
  it("check render with normal text", () => {
    render(<SubMaterialChip label="Teeeest test" />);
    expect(screen.getByText("Teeeest test")).toBeInTheDocument();
  });

  it("check render component text", () => {
    render(<SubMaterialChip label={<span>test span</span>} />);
    expect(screen.getByText("test span")).toBeInTheDocument();
  });

  it("check render actual component", () => {
    render(
      <SubMaterialChip
        label={<span data-testid={"testspan"}>test span</span>}
      />,
    );
    expect(screen.getByTestId("testspan")).toBeInTheDocument();
  });
});
