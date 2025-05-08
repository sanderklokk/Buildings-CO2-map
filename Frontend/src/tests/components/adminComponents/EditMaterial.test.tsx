import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { describe, it, expect, beforeEach } from "vitest";
import { EditMaterial } from "../../../components/adminComponents/EditMaterial";
import userEvent from "@testing-library/user-event";

import { APIMaterialType } from "../../../api/models";
import * as Store from "../../../store/Store";
import {
  create_materialtype,
  delete_materialtype,
  update_materialtypes,
} from "../../../api/materialtypeAPI";
import { AxiosHeaders } from "axios";

vi.mock("../../../api/materialtypeAPI", () => ({
  create_materialtype: vi.fn(),
  delete_materialtype: vi.fn(),
  update_materialtypes: vi.fn(),
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
  farlig: false,
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

describe("EditMaterial", () => {
  beforeEach(() => {
    vi.spyOn(Store, "useBoundStore").mockReturnValue(mockStore);
  });

  it("check correct render", () => {
    render(
      <EditMaterial
        material={mockmaterial}
        open={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByText(mockmaterial.navn)).toBeInTheDocument();
    expect(screen.getByLabelText("Farlig")).toBeInTheDocument();
    expect(screen.getByLabelText("Ny undermateriale")).toBeInTheDocument();
    expect(screen.getByText(mocksubmaterial.navn)).toBeInTheDocument();
    expect(screen.getByText(mocksubsubmaterial.navn)).toBeInTheDocument();
  });

  it("check add a subcategory", async () => {
    vi.mocked(create_materialtype).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: mocksubmaterial,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(
      <EditMaterial
        material={mockmaterial}
        open={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Ny undermateriale"), {
      target: { value: "ny sandtype" },
    });
    fireEvent.click(screen.getByLabelText("Farlig"));
    fireEvent.click(screen.getByText("Legg til"));

    await waitFor(() => {
      expect(create_materialtype).toHaveBeenCalledWith({
        id: null,
        navn: "ny sandtype",
        synlig: true,
        farlig: true,
        forelder: mockmaterial.id,
      });
    });
  });

  it("check delete submaterial works", async () => {
    vi.mocked(delete_materialtype).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: [
        {
          id: mocksubmaterial.id,
          navn: mocksubmaterial.navn,
          synlig: true,
          farlig: true,
          forelder: mockmaterial.id,
        },
        {
          id: mocksubsubmaterial.id,
          navn: mocksubsubmaterial.navn,
          synlig: true,
          farlig: false,
          forelder: mocksubmaterial.id,
        },
      ],
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(
      <EditMaterial
        material={mockmaterial}
        open={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByTestId("delete-submaterial-button-" + mocksubmaterial.id),
    );

    await waitFor(() => {
      expect(screen.getByText("Bekreft sletting")).toBeInTheDocument();
      expect(screen.getByLabelText('Skriv "bekreft"')).toBeInTheDocument();
    });

    const inp = screen.getByLabelText('Skriv "bekreft"');

    fireEvent.change(inp, { target: { value: "bekreft" } });

    await waitFor(() => {
      expect(inp).toHaveValue("bekreft");
    });

    fireEvent.click(screen.getByText("Slett"));

    await waitFor(() => {
      expect(delete_materialtype).toHaveBeenCalledWith(mocksubmaterial.id);
      expect(
        mockStore.materialManagementSlice.removeMaterial,
      ).toHaveBeenCalledWith(mocksubmaterial.id);
    });
  });

  it("check create material", async () => {
    const createdmaterial = {
      id: 4,
      navn: "nytt materiale",
      synlig: true,
      farlig: false,
      forelder: 2,
    };
    vi.mocked(create_materialtype).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: createdmaterial,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(
      <EditMaterial
        material={mockmaterial}
        open={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );
    const selectparent = screen.getByLabelText(
      "Overordnet kategori",
    ) as HTMLSelectElement;
    expect(selectparent).toBeInTheDocument();

    await userEvent.click(selectparent);
    await userEvent.click(screen.getByRole("option", { name: /grus/i }));

    fireEvent.click(screen.getByTestId("create-sub-farlig-switch"));
    fireEvent.change(screen.getByLabelText("Ny undermateriale"), {
      target: { value: "minigrus" },
    });

    fireEvent.click(screen.getByText("Legg til"));

    await waitFor(() => {
      expect(create_materialtype).toHaveBeenCalledWith({
        id: null,
        navn: "minigrus",
        synlig: true,
        farlig: true,
        forelder: mocksubmaterial.id,
      });
    });
  });

  it("check set material hidden and not hidden", async () => {
    const hiddenmaterials = [
      mockmaterial,
      mocksubmaterial,
      mocksubsubmaterial,
    ].map((mat) => ({ ...mat, synlig: false }));

    vi.mocked(update_materialtypes).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: hiddenmaterials,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(
      <EditMaterial
        material={mockmaterial}
        open={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("hidden-switch"));
    fireEvent.click(screen.getByTestId("confirm-hidden"));

    await waitFor(() => {
      expect(update_materialtypes).toHaveBeenCalledWith(
        expect.arrayContaining([
          { ...mockmaterial, synlig: false },
          { ...mocksubmaterial, synlig: false },
          { ...mocksubsubmaterial, synlig: false },
        ]),
      );
    });

    await waitFor(() => {
      expect(
        mockStore.materialManagementSlice.replaceMaterials,
      ).toHaveBeenCalledWith(hiddenmaterials);
    });

    const nothiddenmaterials = [
      mockmaterial,
      mocksubmaterial,
      mocksubsubmaterial,
    ].map((mat) => ({ ...mat, synlig: true }));

    vi.mocked(update_materialtypes).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: nothiddenmaterials,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    fireEvent.click(screen.getByTestId("hidden-switch"));

    await waitFor(() => {
      expect(update_materialtypes).toHaveBeenCalledWith(
        expect.arrayContaining([
          { ...mockmaterial, synlig: true },
          { ...mocksubmaterial, synlig: true },
          { ...mocksubsubmaterial, synlig: true },
        ]),
      );
    });

    await waitFor(() => {
      expect(
        mockStore.materialManagementSlice.replaceMaterials,
      ).toHaveBeenCalledWith(nothiddenmaterials);
    });
  });
});
