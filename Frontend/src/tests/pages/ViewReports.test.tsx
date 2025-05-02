import {
  render as normal_render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { vi, it, describe, expect, beforeEach } from "vitest";
import { get_wastereports } from "../../api/wastereportAPI";
import { APIWasteReportOverview } from "../../api/models";
import { ViewReports } from "../../pages/ViewReports";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AxiosHeaders } from "axios";
import { userEvent } from "@testing-library/user-event";

const mockreport: APIWasteReportOverview = {
  id: 50,
  dato: "2025-01-01",
  address: "Kongens gate 3000",
  postalcode: 5000,
  postalplace: "Trondheim",
  berortbra: 100,
  bygningstype: "",
  konstruksjonstype: "",
  handtering: "",
  type: "",
  totalmaterials: 1000,
  buildingmadedate: "1500-01-01",
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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{element}</BrowserRouter>
    </QueryClientProvider>,
  );
};

vi.mock("../../api/wastereportAPI", () => ({
  get_wastereports: vi.fn(),
}));

describe("ViewReports", () => {
  beforeEach(() => {
    (get_wastereports as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: {
        total: 1,
        results: [mockreport],
      },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
  });

  it("check reports shown", async () => {
    render(<ViewReports />);
    await waitFor(() => {
      expect(
        screen.getByTestId("report-card-" + mockreport.id),
      ).toBeInTheDocument();
    });
  });

  it("check error message", async () => {
    (get_wastereports as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: {
        status: 500,
        data: {
          message: "errror",
        },
      },
    });

    render(<ViewReports />);
    await waitFor(() => {
      expect(screen.getByTestId("reports-error-msg")).toBeInTheDocument();
    });
  });

  it("check both searchinputs", async () => {
    render(<ViewReports />);
    const mainsearch = screen.getByLabelText("Søk i avfallsrapporter");
    const sidebarsearch = screen.getByLabelText("Søk rapport");
    expect(mainsearch).toBeInTheDocument();
    expect(sidebarsearch).toBeInTheDocument();

    await userEvent.type(mainsearch, "trondheimvei 40");

    expect(mainsearch).toHaveValue("trondheimvei 40");
    expect(sidebarsearch).toHaveValue("trondheimvei 40");

    await waitFor(() => {
      expect(get_wastereports).toHaveBeenCalledWith(1, 9, "trondheimvei 40");
    });

    await userEvent.clear(sidebarsearch);

    expect(mainsearch).toHaveValue("");
    expect(sidebarsearch).toHaveValue("");

    await waitFor(() => {
      expect(get_wastereports).toHaveBeenCalledWith(1, 9, "");
    });
  });

  it("check pagination calls api right", async () => {
    (get_wastereports as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: {
        total: 50,
        results: [mockreport],
      },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    render(<ViewReports />);
    await waitFor(() => {
      expect(screen.getByTestId("viewreports-pagination")).toBeInTheDocument();
    });

    const pagesection = screen.getByTestId("viewreports-pagination");
    expect(pagesection).toBeInTheDocument();

    const page2 = within(pagesection).getByText("2");

    await userEvent.click(page2);

    await waitFor(() => {
      expect(get_wastereports).toHaveBeenCalledWith(2, 9, "");
    });

    const page1 = within(pagesection).getByText("1");

    await userEvent.click(page1);

    await waitFor(() => {
      expect(get_wastereports).toHaveBeenCalledWith(1, 9, "");
    });
    const next = within(pagesection).getByLabelText("Go to next page");

    await userEvent.click(next);

    await waitFor(() => {
      expect(get_wastereports).toHaveBeenCalledWith(2, 9, "");
    });
  });
});
