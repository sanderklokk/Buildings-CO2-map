import {
  render as normal_render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Omradesok from "../../../components/SearchComponents/Omradesok";
import { vi, it, expect, beforeEach, describe } from "vitest";

import * as Store from "../../../store/Store";
import { get_all_materialtypes } from "../../../api/materialtypeAPI";
import { get_search_building_materials } from "../../../api/mapsearchAPI";
import { APIMapBuilding, APIMaterialType } from "../../../api/models";
import { AxiosHeaders } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AREAS } from "../../../assets/data/areas";
import { BUILDINGCODES } from "../../../assets/data/buildingcodes";

vi.mock("../../../store/Store", () => ({
  useBoundStore: vi.fn(),
}));

vi.mock("../../../api/materialtypeAPI", () => ({
  get_all_materialtypes: vi.fn(),
}));

vi.mock("../../../api/mapsearchAPI", () => ({
  get_search_building_materials: vi.fn(),
}));

const mockStore = {
  mapSlice: {
    buildings: [],
    setBuildings: vi.fn(),
    setHurtigSokResult: vi.fn(),
  },
};

const mockMaterialsfetchdata: APIMaterialType[] = [
  { id: 1, navn: "grus", forelder: null, farlig: false, synlig: true },
  { id: 2, navn: "planker", forelder: null, farlig: false, synlig: true },
];

const mockBuildingmaterialsdata: APIMapBuilding[] = [
  {
    building: 1,
    latitude: 1.0,
    longitude: 1.0,
    totalamount: 100,
  },
  {
    building: 2,
    latitude: 2.0,
    longitude: 2.0,
    totalamount: 200,
  },
  {
    building: 3,
    latitude: 3.0,
    longitude: 3.0,
    totalamount: 300,
  },
];

const render = (element: React.ReactElement) => {
  const queryClient = new QueryClient();
  return normal_render(
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>,
    {
      container: document.body,
    },
  );
};

describe("Omradesok", () => {
  beforeEach(() => {
    vi.spyOn(Store, "useBoundStore").mockReturnValue(mockStore);
    (get_all_materialtypes as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: mockMaterialsfetchdata,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
  });

  it("check correct render", () => {
    render(<Omradesok />);
    expect(screen.getByTestId("omradesok-sok-btn")).toBeInTheDocument();
    expect(screen.getByTestId("byggtype-select")).toBeInTheDocument();
    expect(screen.getByTestId("omrade-select")).toBeInTheDocument();
    expect(screen.getByTestId("materialtype-select")).toBeInTheDocument();
  });

  it("check that is fetches materials for the materiallist", async () => {
    render(<Omradesok />);
    expect(get_all_materialtypes).toHaveBeenCalledWith(true);
  });

  it("check that fetched materials are in the list", async () => {
    render(<Omradesok />);

    const select = screen.getByLabelText("Materialtype");

    await userEvent.click(select);

    await waitFor(() => {
      expect(screen.getByTestId("materialtype-option-1")).toBeInTheDocument();
      expect(screen.getByTestId("materialtype-option-2")).toBeInTheDocument();
      expect(screen.getByText("grus")).toBeInTheDocument();
      expect(screen.getByText("planker")).toBeInTheDocument();
    });
  });
  it("check search is called with correct data", async () => {
    (
      get_search_building_materials as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: [],
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<Omradesok />);

    await userEvent.click(screen.getByLabelText("Byggtype"));
    await userEvent.click(
      screen.getByText(BUILDINGCODES[0].id + " " + BUILDINGCODES[0].label),
    );
    await userEvent.click(
      screen.getByText(BUILDINGCODES[1].id + " " + BUILDINGCODES[1].label),
    );

    await userEvent.click(screen.getByLabelText("Område"));
    await userEvent.click(screen.getByText(AREAS[0].label));

    await userEvent.click(screen.getByLabelText("Materialtype"));
    await userEvent.click(screen.getByText("grus"));

    await userEvent.click(screen.getByTestId("omradesok-sok-btn"));

    await waitFor(() => {
      expect(get_search_building_materials).toHaveBeenCalledWith(
        [mockMaterialsfetchdata[0].id],
        [BUILDINGCODES[0].id, BUILDINGCODES[1].id],
        AREAS[0],
      );
    });
  });

  it("check updates building state after search", async () => {
    vi.fn(get_search_building_materials).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: mockBuildingmaterialsdata,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<Omradesok />);

    await userEvent.click(screen.getByLabelText("Byggtype"));
    await userEvent.click(
      screen.getByText(BUILDINGCODES[0].id + " " + BUILDINGCODES[0].label),
    );

    await userEvent.click(screen.getByTestId("omradesok-sok-btn"));

    await waitFor(() => {
      expect(mockStore.mapSlice.setBuildings).toHaveBeenCalledWith([]);
    });
  });
});
