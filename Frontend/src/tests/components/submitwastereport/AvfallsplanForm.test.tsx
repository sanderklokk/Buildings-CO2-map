import { describe, vi } from "vitest";
import {
  render as normal_render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, it, expect } from "vitest";
import { useBoundStore } from "../../../store/Store";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIMaterialType } from "../../../api/models";
import { get_all_materialtypes } from "../../../api/materialtypeAPI";
import { AxiosHeaders } from "axios";
import { AvfallsplanForm } from "../../../components/submitwastereport/AvfallsplanForm";

vi.mock("../../../api/materialtypeAPI", () => ({
  get_all_materialtypes: vi.fn(),
}));

const mockMaterialsfetchdata: APIMaterialType[] = [
  { id: 1, navn: "grus", forelder: null, farlig: false, synlig: true },
  { id: 2, navn: "planker", forelder: null, farlig: false, synlig: true },
  { id: 3, navn: "grusatomer", forelder: 1, farlig: false, synlig: true },
  { id: 4, navn: "stein", forelder: null, farlig: false, synlig: true },
  { id: 5, navn: "litenstein", forelder: 4, farlig: false, synlig: true },
  { id: 6, navn: "ministein", forelder: 5, farlig: false, synlig: true },
  { id: 7, navn: "superfarlig", forelder: null, farlig: true, synlig: true },
];

const render = (element: React.ReactElement) => {
  const queryClient = new QueryClient();
  return normal_render(
    <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>,
  );
};

describe("AvfallsplanForm", () => {
  beforeEach(() => {
    (get_all_materialtypes as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: mockMaterialsfetchdata,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    useBoundStore.setState({
      wasteReportForm: {
        ...useBoundStore.getState().wasteReportForm,
        wasteReport: {
          ...useBoundStore.getState().wasteReportForm.wasteReport,
          avfall: {
            ordinert: [],
            farlig: [],
          },
        },
      },
    });
  });

  it("check render select and table", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const ordinertheadtable = screen.getByTestId("reportform-ordinert-head");
    const farligheadtable = screen.getByTestId("reportform-farlig-head");
    expect(ordinertheadtable).toBeInTheDocument();
    expect(farligheadtable).toBeInTheDocument();
  });

  it("check search in select", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Materialtype");
    await userEvent.click(select);

    // only materials without parents are intially shown, but submaterials appears when searching
    expect(screen.getByText("grus")).toBeInTheDocument();
    expect(screen.getByText("planker")).toBeInTheDocument();
    expect(screen.queryByText("grusatomer")).not.toBeInTheDocument();

    const searchinput = screen.getByTestId("reportform-material-input");
    await userEvent.type(searchinput, "gr");

    expect(screen.getByText("grus")).toBeInTheDocument();
    expect(screen.queryByText("planker")).not.toBeInTheDocument();
    expect(screen.getByText("grusatomer")).toBeInTheDocument();
  });

  it("check add material", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Materialtype");
    await userEvent.click(select);

    const searchinput = screen.getByTestId("reportform-material-input");
    await userEvent.type(searchinput, "gr");

    await userEvent.click(screen.getByText("grusatomer"));

    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      const addedrow = wasteReportForm.wasteReport.avfall.ordinert.find(
        (i) => i.id === 3,
      );
      if (addedrow == undefined) {
        throw new Error("row not added correctly");
      }
    });
  });

  it("check add submaterial after selecting parent", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Materialtype");
    await userEvent.click(select);

    const searchinput = screen.getByTestId("reportform-material-input");
    await userEvent.type(searchinput, "gr");

    await userEvent.click(screen.getByText("grus"));

    expect(screen.getByText("grus")).toBeInTheDocument();
    expect(screen.getByText("grusatomer")).toBeInTheDocument();

    await userEvent.click(screen.getByText("grusatomer"));
    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      const addedrow = wasteReportForm.wasteReport.avfall.ordinert.find(
        (i) => i.id === 3,
      );
      if (addedrow == undefined) {
        throw new Error("row not added correctly");
      }
    });
  });

  it("check add parent material then sub", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Materialtype");
    await userEvent.click(select);

    const searchinput = screen.getByTestId("reportform-material-input");
    await userEvent.type(searchinput, "gr");

    await userEvent.click(screen.getByText("grus"));
    await userEvent.click(screen.getByTestId("reportform-add-parent-material"));

    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      const addedrow = wasteReportForm.wasteReport.avfall.ordinert.find(
        (i) => i.id === 1,
      );
      if (addedrow == undefined) {
        throw new Error("row not added correctly");
      }
    });

    await userEvent.click(select);

    await userEvent.type(searchinput, "gr");

    const grus = screen.queryAllByText("grus");
    const notintable = grus.filter((e) => {
      return !e.closest("table");
    });
    await userEvent.click(notintable[0]);

    await userEvent.click(screen.getByText("grusatomer"));

    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      const addedrow = wasteReportForm.wasteReport.avfall.ordinert.find(
        (i) => i.id === 3,
      );
      if (addedrow == undefined) {
        throw new Error("row not added correctly");
      }
    });
  });

  it("check no submaterials message", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Materialtype");
    await userEvent.click(select);

    const searchinput = screen.getByTestId("reportform-material-input");
    await userEvent.type(searchinput, "gr");

    await userEvent.click(screen.getByText("grusatomer"));

    await userEvent.click(select);

    await userEvent.type(searchinput, "gr");

    const grus = screen.queryAllByText("grus");
    const notintable = grus.filter((e) => {
      return !e.closest("table");
    });
    await userEvent.click(notintable[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Ingen gjenværende underkategorier"),
      ).toBeInTheDocument();
    });
  });

  it("check recursive submaterials", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Materialtype");
    await userEvent.click(select);

    await userEvent.click(screen.getByText("stein"));

    await waitFor(() => {
      expect(screen.getByText("stein")).toBeInTheDocument();
      expect(screen.getByText("litenstein")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("litenstein"));
    await waitFor(() => {
      expect(screen.getByText("litenstein")).toBeInTheDocument();
      expect(screen.getByText("ministein")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("ministein"));

    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      const addedrow = wasteReportForm.wasteReport.avfall.ordinert.find(
        (i) => i.id === 6,
      );
      if (addedrow == undefined) {
        throw new Error("row not added correctly");
      }
    });
  });

  it("check farlig material added", async () => {
    render(<AvfallsplanForm />);
    await waitFor(() => {
      expect(screen.getByLabelText("Materialtype")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Materialtype");
    await userEvent.click(select);

    const searchinput = screen.getByTestId("reportform-material-input");
    await userEvent.type(searchinput, "superfarlig");

    await userEvent.click(screen.getByText("superfarlig"));

    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      const addedrow = wasteReportForm.wasteReport.avfall.farlig.find(
        (i) => i.id === 7,
      );
      if (addedrow == undefined) {
        throw new Error("row not added correctly");
      }
    });
  });
});
