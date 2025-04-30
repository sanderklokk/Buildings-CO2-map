import { render, screen, fireEvent } from "@testing-library/react";
import MaterialCard from "../../../components/adminComponents/MaterialCard";
import { vi } from "vitest";
import * as Store from "../../../store/Store";
import { APIMaterialType } from "../../../api/models";
import { describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../store/Store", () => ({
  useBoundStore: vi.fn(),
}));

const mockmaterial: APIMaterialType = {
  id: 1,
  navn: "stein",
  synlig: true,
  farlig: false,
  forelder: null,
};
const mocksubmaterial: APIMaterialType = {
  id: 2,
  navn: "grus",
  synlig: true,
  farlig: true,
  forelder: 1,
};

const mocksubsubmaterial: APIMaterialType = {
  id: 3,
  navn: "sand",
  synlig: true,
  farlig: true,
  forelder: 2,
};

const mockStore = {
  materialManagementSlice: {
    materials: [mockmaterial, mocksubmaterial, mocksubsubmaterial],
    setMaterials: vi.fn(),
    replaceMaterials: vi.fn(),
    removeMaterial: vi.fn(),
  },
};

const mockMaterials: APIMaterialType[] = [
  mockmaterial,
  mocksubmaterial,
  mocksubsubmaterial,
];

describe("MaterialCard", () => {
  beforeEach(() => {
    vi.spyOn(Store, "useBoundStore").mockReturnValue(mockStore);
  });

  it("check materialname and visibility renders", () => {
    render(<MaterialCard material={mockMaterials[0]} />);
    expect(screen.getByText(/stein/i)).toBeInTheDocument();
    expect(screen.getByText("Synlig")).toBeInTheDocument();
  });

  it("check warning icon if material is dangerous", () => {
    render(<MaterialCard material={mockMaterials[1]} />);
    expect(screen.getByTestId("dangerous-icon")).toBeInTheDocument();
  });

  it("check dangerous icon for parent element", () => {
    const newmat = { ...mockMaterials[2] };
    newmat.forelder = null;
    newmat.farlig = true;
    render(<MaterialCard material={mockMaterials[2]} />);
    expect(screen.getByText(/sand/i)).toBeInTheDocument();
    expect(screen.getByTestId("dangerous-icon-parent")).toBeInTheDocument();
  });

  it("check rendering subcategories", () => {
    render(<MaterialCard material={mockMaterials[0]} />);
    expect(screen.getByText(/stein/i)).toBeInTheDocument();
    expect(screen.getByText(/grus/i)).toBeInTheDocument();
    expect(screen.getByText(/sand/i)).toBeInTheDocument();
  });

  it("check open edit popup when clicking edit", () => {
    render(<MaterialCard material={mockMaterials[0]} />);
    const editButton = screen.getByText("Rediger materiale");
    fireEvent.click(editButton);
    expect(screen.getByTestId("edit-material-popup")).toBeInTheDocument();
  });

  it("check show hidden for hidden materials", () => {
    const hiddenMaterial = { ...mockMaterials[0], synlig: false };
    render(<MaterialCard material={hiddenMaterial} />);
    expect(screen.getByText("Skjult")).toBeInTheDocument();
  });
});
