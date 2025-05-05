import { describe, vi, it, expect } from "vitest";
import { get_wastereport } from "../../../api/wastereportAPI";
import {
  render as normal_render,
  waitFor,
  screen,
  within,
} from "@testing-library/react";

import { AxiosError, AxiosHeaders } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DetailedReport } from "../../../pages/DetailedReport";
import { APIWasteReportDetailed } from "../../../api/models";

vi.mock("../../../api/wastereportAPI", () => ({
  get_wastereport: vi.fn(),
}));

const mockreport: APIWasteReportDetailed = {
  id: 1304,
  address: "kongens gate 3",
  postalplace: "trondheim",
  postalcode: 5000,
  type: "nybygg",
  berortbra: 1000,
  bygningstype: "hus",
  konstruksjonstype: "betong",
  handtering: "sendes til gjenvinning",
  dato: "2025-03-03",
  totalmaterials: 500,
  buildingmadedate: "1900-10-10",
  materialer: [
    {
      id: 1,
      planlagtmengde: 100,
      faktiskmengde: 50,
      mengdetilgjenbruk: 10,
      mengdetilanlegg: 40,
      anlegg: "trondheim gjenvinning",
      totalmengde: 50,
      rapport: 1304,
      materiale: 1,
      navn: "treverk",
      forelder: null,
      farlig: false,
    },
    {
      id: 2,
      planlagtmengde: 100,
      faktiskmengde: 50,
      mengdetilgjenbruk: 10,
      mengdetilanlegg: 40,
      anlegg: "legges i skogen",
      totalmengde: 50,
      rapport: 1304,
      materiale: 2,
      navn: "jord",
      forelder: null,
      farlig: false,
    },
    {
      id: 3,
      planlagtmengde: 100,
      faktiskmengde: 400,
      mengdetilgjenbruk: 0,
      mengdetilanlegg: 400,
      anlegg: "farlig stasjon",
      totalmengde: 400,
      rapport: 1304,
      materiale: 3,
      navn: "farlig",
      forelder: null,
      farlig: true,
    },
  ],
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
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>,
  );
};

describe("DetailedReport", () => {
  it("check fetches report based on url parameter", async () => {
    vi.mock("react-router-dom", () => ({
      useParams: vi.fn(() => ({ id: mockreport.id.toString() })),
    }));
    render(<DetailedReport />);

    await waitFor(() => {
      expect(get_wastereport).toHaveBeenCalledWith(mockreport.id.toString());
    });
  });

  it("check correct render of data", async () => {
    vi.mock("react-router-dom", () => ({
      useParams: vi.fn(() => ({ id: mockreport.id.toString() })),
    }));

    (get_wastereport as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      data: mockreport,
    });

    render(<DetailedReport />);
    await waitFor(() => {
      expect(get_wastereport).toHaveBeenCalledWith(mockreport.id.toString());
    });

    expect(screen.getByText("Ref: " + mockreport.id)).toBeInTheDocument();

    const inpaddr = within(
      screen.getByTestId("detailedreport-gjelder-adresse-inp"),
    ).getByRole("textbox");
    expect(inpaddr).toHaveValue(mockreport.address);
    const inppostnr = within(
      screen.getByTestId("detailedreport-gjelder-postnr-inp"),
    ).getByRole("textbox");
    expect(inppostnr).toHaveValue(mockreport.postalcode.toString());
    const inppoststed = within(
      screen.getByTestId("detailedreport-gjelder-poststed-inp"),
    ).getByRole("textbox");
    expect(inppoststed).toHaveValue(mockreport.postalplace);

    const radionybygg = within(
      screen.getByTestId("detailedreport-gjelder-tiltak-nybygg-radio"),
    ).getByRole("radio");
    expect(radionybygg).toBeChecked();
    const radioriving = within(
      screen.getByTestId("detailedreport-gjelder-tiltak-riving-radio"),
    ).getByRole("radio");
    expect(radioriving).not.toBeChecked();
    const radiombygging = within(
      screen.getByTestId("detailedreport-gjelder-tiltak-ombygging-radio"),
    ).getByRole("radio");
    expect(radiombygging).not.toBeChecked();

    const inpberortbra = within(
      screen.getByTestId("detailedreport-gjelder-berortbra-inp"),
    ).getByRole("textbox");
    expect(inpberortbra).toHaveValue(mockreport.berortbra.toString());
    const inpbyningstype = within(
      screen.getByTestId("detailedreport-gjelder-bygningstype-inp"),
    ).getByRole("textbox");
    expect(inpbyningstype).toHaveValue(mockreport.bygningstype);
    const inpkonstruksjonstype = within(
      screen.getByTestId("detailedreport-gjelder-konstruksjonstype-inp"),
    ).getByRole("textbox");
    expect(inpkonstruksjonstype).toHaveValue(mockreport.konstruksjonstype);
    const inphandtering = within(
      screen.getByTestId("detailedreport-gjelder-beskrivelse-inp"),
    ).getByRole("textbox");
    expect(inphandtering).toHaveValue(mockreport.handtering);

    const table = screen.getByTestId("detailedreport-materialtable");
    expect(table).toBeInTheDocument();

    const treverkrow = within(table).getByText("treverk").closest("tr");
    expect(treverkrow).toBeInTheDocument();
    if (!treverkrow) {
      throw new Error("row for treverk not found");
    }

    const treverkreport = mockreport.materialer.find(
      (m) => m.navn == "treverk",
    );
    if (!treverkreport) {
      throw new Error("treverkrow not in mockreport");
    }

    expect(
      within(treverkrow).getByTestId("detailedreport-row-planned"),
    ).toHaveTextContent(treverkreport.planlagtmengde.toString());
    expect(
      within(treverkrow).getByTestId("detailedreport-row-actual"),
    ).toHaveTextContent(treverkreport.faktiskmengde.toString());
    expect(
      within(treverkrow).getByTestId("detailedreport-row-difference"),
    ).toHaveTextContent(
      (treverkreport.faktiskmengde - treverkreport.planlagtmengde).toString(),
    );
    expect(
      within(treverkrow).getByTestId("detailedreport-row-toreuse"),
    ).toHaveTextContent(treverkreport.mengdetilgjenbruk.toString());
    expect(
      within(treverkrow).getByTestId("detailedreport-row-tofacility"),
    ).toHaveTextContent(treverkreport.mengdetilanlegg.toString());
    expect(
      within(treverkrow).getByTestId("detailedreport-row-facility"),
    ).toHaveTextContent(treverkreport.anlegg);

    const jordrow = within(table).getByText("jord").closest("tr");
    expect(jordrow).toBeInTheDocument();
    if (!jordrow) {
      throw new Error("row for jord not found");
    }
    const jordreport = mockreport.materialer.find((m) => m.navn == "jord");
    if (!jordreport) {
      throw new Error("jordrow not in mockreport");
    }
    expect(
      within(jordrow).getByTestId("detailedreport-row-planned"),
    ).toHaveTextContent(jordreport.planlagtmengde.toString());
    expect(
      within(jordrow).getByTestId("detailedreport-row-actual"),
    ).toHaveTextContent(jordreport.faktiskmengde.toString());
    expect(
      within(jordrow).getByTestId("detailedreport-row-difference"),
    ).toHaveTextContent(
      (jordreport.faktiskmengde - jordreport.planlagtmengde).toString(),
    );
    expect(
      within(jordrow).getByTestId("detailedreport-row-toreuse"),
    ).toHaveTextContent(jordreport.mengdetilgjenbruk.toString());
    expect(
      within(jordrow).getByTestId("detailedreport-row-tofacility"),
    ).toHaveTextContent(jordreport.mengdetilanlegg.toString());
    expect(
      within(jordrow).getByTestId("detailedreport-row-facility"),
    ).toHaveTextContent(jordreport.anlegg);

    const farligrow = within(table).getByText("farlig").closest("tr");
    expect(farligrow).toBeInTheDocument();
    if (!farligrow) {
      throw new Error("row for farlig not found");
    }
    const farligreport = mockreport.materialer.find((m) => m.navn == "farlig");
    if (!farligreport) {
      throw new Error("farligrow not in mockreport");
    }
    expect(
      within(farligrow).getByTestId("detailedreport-row-planned"),
    ).toHaveTextContent(farligreport.planlagtmengde.toString());
    expect(
      within(farligrow).getByTestId("detailedreport-row-actual"),
    ).toHaveTextContent(farligreport.faktiskmengde.toString());
    expect(
      within(farligrow).getByTestId("detailedreport-row-difference"),
    ).toHaveTextContent(
      (farligreport.faktiskmengde - farligreport.planlagtmengde).toString(),
    );
    expect(
      within(farligrow).getByTestId("detailedreport-row-toreuse"),
    ).toHaveTextContent(farligreport.mengdetilgjenbruk.toString());
    expect(
      within(farligrow).getByTestId("detailedreport-row-tofacility"),
    ).toHaveTextContent(farligreport.mengdetilanlegg.toString());
    expect(
      within(farligrow).getByTestId("detailedreport-row-facility"),
    ).toHaveTextContent(farligreport.anlegg);
  });

  it("check error message", async () => {
    vi.mock("react-router-dom", () => ({
      useParams: vi.fn(() => ({ id: mockreport.id.toString() })),
    }));

    (get_wastereport as ReturnType<typeof vi.fn>).mockRejectedValue(
      new AxiosError(
        "error",
        "500",
        {
          headers: new AxiosHeaders(),
        },
        {},
        {
          status: 500,
          statusText: "server error",
          headers: {},
          config: { headers: new AxiosHeaders() },
          data: {},
        },
      ),
    );

    render(<DetailedReport />);

    await waitFor(() => {
      expect(
        screen.getByText("Feil oppstod under henting av rapport."),
      ).toBeInTheDocument();
    });
  });
});
