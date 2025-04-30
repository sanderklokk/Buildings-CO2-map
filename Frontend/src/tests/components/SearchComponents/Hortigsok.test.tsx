import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HortigSok from "../../../components/SearchComponents/Hortigsok";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { get_address_search } from "../../../api/geonorgeAPI";
import { get_closest_building_materials } from "../../../api/mapsearchAPI";

import * as Store from "../../../store/Store";
import { APIAdresseSok, APIMapBuilding } from "../../../api/models";
import { AxiosHeaders } from "axios";

vi.mock("../../../api/geonorgeAPI", () => ({
  get_address_search: vi.fn(),
}));

vi.mock("../../../api/mapsearchAPI", () => ({
  get_closest_building_materials: vi.fn(),
}));

vi.mock("../../../store/Store", () => ({
  useBoundStore: vi.fn(),
}));

const mockAddressSearchData: APIAdresseSok = {
  metadata: {
    totaltAntallTreff: 1,
    sokeStreng: "trondheims gate 3000",
  },

  adresser: [
    {
      adressetekst: "Trondheims gate 3000",
      kommunenavn: "Trondheim",
      representasjonspunkt: {
        epsg: "0",
        lat: 20,
        lon: 20,
      },
      kommunenummer: "0",
      adressenavn: "",
      nummer: 0,
      bokstav: "",
      gardsnummer: "",
      bruksnummer: "",
      festenummer: "",
      objtype: "",
      poststed: "",
      postnummer: "",
    },
  ],
};

const mockedClosestBuilding: APIMapBuilding = {
  latitude: 20,
  longitude: 20,
  building: 1,
  totalamount: 1,
};

const mockStore = {
  mapSlice: {
    setHurtigSokResult: vi.fn(),
    setBuildings: vi.fn(),
  },
};

describe("Hortigsok", () => {
  beforeEach(() => {
    vi.spyOn(Store, "useBoundStore").mockReturnValue(mockStore);
  });

  it("check render input and btn", () => {
    render(<HortigSok />);
    expect(screen.getByLabelText("Hurtigsøk på bygg")).toBeInTheDocument();
    expect(screen.getByTestId("hortigsok-sok-btn")).toBeInTheDocument();
  });

  it("check toggle detailed search", () => {
    render(<HortigSok />);

    expect(screen.queryByLabelText("Gårdsnr")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bruksnr")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Seksjonsnr")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("toggle-detailed-search-btn"));
    expect(screen.queryByLabelText("Gårdsnr")).toBeInTheDocument();
    expect(screen.queryByLabelText("Bruksnr")).toBeInTheDocument();
    expect(screen.queryByLabelText("Seksjonsnr")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("toggle-detailed-search-btn"));
    expect(screen.queryByLabelText("Gårdsnr")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bruksnr")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Seksjonsnr")).not.toBeInTheDocument();
  });

  it("check calls adress search with correct info", async () => {
    vi.mocked(get_address_search).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: mockAddressSearchData,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<HortigSok />);
    fireEvent.change(screen.getByLabelText("Hurtigsøk på bygg"), {
      target: { value: mockAddressSearchData.metadata.sokeStreng },
    });
    fireEvent.click(screen.getByTestId("hortigsok-sok-btn"));

    await waitFor(() => {
      expect(get_address_search).toHaveBeenCalledWith({
        query: mockAddressSearchData.metadata.sokeStreng,
        count: 10,
        gardsnummer: "",
        bruksnummer: "",
        festenummer: "",
      });
    });
    expect(await screen.findByText("Resultater (1)")).toBeInTheDocument();
    expect(
      await screen.findByText(mockAddressSearchData.adresser[0].adressetekst),
    ).toBeInTheDocument();
    expect(await screen.findByText("Trondheim")).toBeInTheDocument();
  });

  it("check call with detailed search", async () => {
    vi.mocked(get_address_search).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: mockAddressSearchData,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<HortigSok />);

    fireEvent.click(screen.getByTestId("toggle-detailed-search-btn"));

    fireEvent.change(screen.getByLabelText("Gårdsnr"), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText("Bruksnr"), {
      target: { value: "400" },
    });
    fireEvent.change(screen.getByLabelText("Seksjonsnr"), {
      target: { value: "300" },
    });

    fireEvent.click(screen.getByTestId("hortigsok-sok-btn"));

    await waitFor(() => {
      expect(get_address_search).toHaveBeenCalledWith({
        query: "",
        count: 10,
        gardsnummer: "500",
        bruksnummer: "400",
        festenummer: "300",
      });
    });
  });

  it("check error message no building registered", async () => {
    vi.mocked(get_address_search).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: mockAddressSearchData,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<HortigSok />);
    fireEvent.change(screen.getByLabelText("Hurtigsøk på bygg"), {
      target: { value: mockAddressSearchData.metadata.sokeStreng },
    });

    fireEvent.click(screen.getByTestId("hortigsok-sok-btn"));
    await waitFor(() => {
      expect(
        screen.getByTestId("hurtigsok-select-adress-" + 0),
      ).toBeInTheDocument();
    });

    vi.mocked(get_closest_building_materials).mockRejectedValueOnce(
      new Error("404"),
    );

    fireEvent.click(screen.getByTestId("hurtigsok-select-adress-" + 0));

    await waitFor(() => {
      expect(get_closest_building_materials).toHaveBeenCalledWith(
        mockAddressSearchData.adresser[0].representasjonspunkt.lat,
        mockAddressSearchData.adresser[0].representasjonspunkt.lon,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("Feil: Valgt bygg er ikke registrert."),
      ).toBeInTheDocument();
    });
  });

  it("check hurtigsokstate set to selected building", async () => {
    vi.mocked(get_address_search).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: mockAddressSearchData,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<HortigSok />);
    fireEvent.change(screen.getByLabelText("Hurtigsøk på bygg"), {
      target: { value: mockAddressSearchData.metadata.sokeStreng },
    });

    fireEvent.click(screen.getByTestId("hortigsok-sok-btn"));
    await waitFor(() => {
      expect(
        screen.getByTestId("hurtigsok-select-adress-" + 0),
      ).toBeInTheDocument();
    });
    vi.mocked(get_closest_building_materials).mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: mockedClosestBuilding,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    fireEvent.click(screen.getByTestId("hurtigsok-select-adress-" + 0));

    const { setHurtigSokResult } = mockStore.mapSlice;

    await waitFor(() => {
      expect(setHurtigSokResult).toHaveBeenCalledWith(mockedClosestBuilding);
    });
  });
});
