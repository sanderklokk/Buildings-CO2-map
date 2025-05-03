import { render as normal_render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { BuildingForm } from "../../../components/submitwastereport/BuildingForm";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { get_address_search } from "../../../api/geonorgeAPI";
import { get_closest_building } from "../../../api/mapsearchAPI";
import * as Store from "../../../store/Store";
import { APIAdresseSok, APIDetailedBuilding } from "../../../api/models";
import { AxiosHeaders } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

vi.mock("../../../api/geonorgeAPI", () => ({
    get_address_search: vi.fn(),
}));

vi.mock("../../../api/mapsearchAPI", () => ({
    get_closest_building: vi.fn(),
}));

vi.mock("../../../store/Store", () => ({
    useBoundStore: vi.fn(() => ({
        wasteReportForm: {
            setBygning: vi.fn(),
        },
    })),
}));

const mockStore = {
    wasteReportForm: {
        setBygning: vi.fn(),
    },
};


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
        {
            adressetekst: "Trondheims gate 3001",
            kommunenavn: "Trondheim",
            representasjonspunkt: {
                epsg: "0",
                lat: 30,
                lon: 30,
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

const mockClosestbuilding: APIDetailedBuilding = {
    byggningsnr: 1000,
    bygningstatuskode: "",
    kommuneId: 0,
    byggningstypekode: 0,
    byggningstype: "",
    antallboenheter: 0,
    antalletasjer: 0,
    bebygdareal: 0,
    bruksarealtotalt: 0,
    bruksarealbolig: 0,
    bruksarealannet: 0,
    bygdDato: "2025-05-09",
};

const render = (element: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return normal_render(
        <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>
    );
};


describe("BuildingForm", () => {
    beforeEach(() => {
        vi.spyOn(Store, "useBoundStore").mockReturnValue(mockStore);

        vi.mocked(get_address_search).mockResolvedValueOnce({
            status: 200,
            data: mockAddressSearchData,
            headers: {},
            config: { headers: new AxiosHeaders() },
            statusText: "OK",
        });

    });

    it("check render", async () => {
        render(<BuildingForm />);

        expect(screen.getByText("Søk etter bygning")).toBeInTheDocument();
        expect(screen.getByTestId("reportform-search-inp")).toBeInTheDocument();
        expect(screen.getByTestId("reportform-search-btn")).toBeInTheDocument();

    });

    it("check search called correctly", async () => {

        render(<BuildingForm />);
        const searchinp = within(screen.getByTestId("reportform-search-inp")).getByRole("textbox");
        fireEvent.change(searchinp, {
            target: { value: "trondheims gate 3000" },
        });
        expect(searchinp).toHaveValue("trondheims gate 3000");
        const searchbtn = screen.getByTestId("reportform-search-btn");
        await userEvent.click(searchbtn);
        await waitFor(() => {
            expect(get_address_search).toHaveBeenCalledWith({
                query: "trondheims gate 3000",
                count: 5,
            });
        });
    });

    it("check search results rendered", async () => {

        render(<BuildingForm />);
        const searchinp = within(screen.getByTestId("reportform-search-inp")).getByRole("textbox");
        fireEvent.change(searchinp, {
            target: { value: "trondheims gate 3000" },
        });
        expect(searchinp).toHaveValue("trondheims gate 3000");
        const searchbtn = screen.getByTestId("reportform-search-btn");
        await userEvent.click(searchbtn);
        await waitFor(() => {
            expect(get_address_search).toHaveBeenCalledWith({
                query: "trondheims gate 3000",
                count: 5,
            });

        });

        expect(screen.getByText("Trondheims gate 3000")).toBeInTheDocument();
        expect(screen.getByText("Trondheims gate 3001")).toBeInTheDocument();
        expect(screen.getByTestId("select-address-" + mockAddressSearchData.adresser[0].adressetekst + "-btn")).toBeInTheDocument();
        expect(screen.getByTestId("select-address-" + mockAddressSearchData.adresser[1].adressetekst + "-btn")).toBeInTheDocument();

    });

    it("check select and remove address", async () => {


        vi.mocked(get_closest_building).mockResolvedValue({
            status: 200,
            data: mockClosestbuilding,
            headers: {},
            config: { headers: new AxiosHeaders() },
            statusText: "OK",
        });

        render(<BuildingForm />);
        const searchinp = within(screen.getByTestId("reportform-search-inp")).getByRole("textbox");
        fireEvent.change(searchinp, {
            target: { value: "trondheims gate 3000" },
        });
        expect(searchinp).toHaveValue("trondheims gate 3000");
        const searchbtn = screen.getByTestId("reportform-search-btn");
        await userEvent.click(searchbtn);
        await waitFor(() => {
            expect(get_address_search).toHaveBeenCalledWith({
                query: "trondheims gate 3000",
                count: 5,
            });

        });

        expect(screen.getByText("Trondheims gate 3000")).toBeInTheDocument();
        expect(screen.getByText("Trondheims gate 3001")).toBeInTheDocument();

        const selectaddressbtn = screen.getByTestId("select-address-" + mockAddressSearchData.adresser[0].adressetekst + "-btn")
        expect(selectaddressbtn).toBeInTheDocument();
        await userEvent.click(selectaddressbtn);

        await waitFor(() => {
            expect(get_closest_building).toHaveBeenCalledWith(
                mockAddressSearchData.adresser[0].representasjonspunkt.lat,
                mockAddressSearchData.adresser[0].representasjonspunkt.lon
            );
        });
        expect(Store.useBoundStore().wasteReportForm.setBygning).toHaveBeenCalledWith(
            mockClosestbuilding.byggningsnr
        );
        expect(screen.getByText(/Trondheims gate 3000/i)).toBeInTheDocument();
        expect(screen.getByText(/2025-05-09, #1000/i)).toBeInTheDocument();


        const removeaddressbtn = screen.getByTestId("reportform-remove-adr-btn");
        expect(removeaddressbtn).toBeInTheDocument();
        await userEvent.click(removeaddressbtn);
        await waitFor(() => {
            expect(Store.useBoundStore().wasteReportForm.setBygning).toHaveBeenCalledWith(
                null
            );
        });
    });

    it("check cant find building error", async () => {
        vi.mocked(get_address_search).mockResolvedValueOnce({
            status: 200,
            data: mockAddressSearchData,
            headers: {},
            config: { headers: new AxiosHeaders() },
            statusText: "OK",
        });

        vi.mocked(get_closest_building).mockRejectedValue({
            status: 500,
            data: mockClosestbuilding,
            headers: {},
            config: { headers: new AxiosHeaders() },
            statusText: "error",
        });

        render(<BuildingForm />);
        const searchinp = within(screen.getByTestId("reportform-search-inp")).getByRole("textbox");
        fireEvent.change(searchinp, {
            target: { value: "trondheims gate 3000" },
        });
        await userEvent.click(screen.getByTestId("reportform-search-btn"));

        await waitFor(() => {
            expect(get_address_search).toHaveBeenCalledWith({
                query: "trondheims gate 3000",
                count: 5,
            });

        });

        const selectaddressbtn = screen.getByTestId("select-address-" + mockAddressSearchData.adresser[0].adressetekst + "-btn")
        expect(selectaddressbtn).toBeInTheDocument();
        await userEvent.click(selectaddressbtn);

        await waitFor(() => {
            expect(get_closest_building).toHaveBeenCalledWith(
                mockAddressSearchData.adresser[0].representasjonspunkt.lat,
                mockAddressSearchData.adresser[0].representasjonspunkt.lon
            );
        });

        expect(screen.getByText("Det oppstod en feil / Bygning ikke registrert.")).toBeInTheDocument();

    });

    it("check search error", async () => {
        vi.resetAllMocks();
        vi.mocked(get_address_search).mockRejectedValue(new Error("500"));
        render(<BuildingForm />);
        const searchinp = within(screen.getByTestId("reportform-search-inp")).getByRole("textbox");

        fireEvent.change(searchinp, {
            target: { value: "trondheims gate 3000" },
        });
        expect(searchinp).toHaveValue("trondheims gate 3000");
        const searchbtn = screen.getByTestId("reportform-search-btn");
        await userEvent.click(searchbtn);
        await waitFor(() => {
            expect(get_address_search).toHaveBeenCalledWith({
                query: "trondheims gate 3000",
                count: 5,
            });

        });
        await waitFor(() => {
            expect(screen.getByText("Feil ved henting av adresser")).toBeInTheDocument();
        }
        );
    });

});