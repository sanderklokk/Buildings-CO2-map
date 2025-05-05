import { beforeEach, describe, vi, it, expect } from "vitest";
import {
  render as normal_render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, AxiosHeaders } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIMaterialType } from "../../../api/models";
import {
  get_all_materialtypes,
  create_materialtype,
} from "../../../api/materialtypeAPI";
import MaterialManagement from "../../../pages/MaterialManagement";
import { BrowserRouter } from "react-router-dom";
import { useBoundStore } from "../../../store/Store";

vi.mock("../../../api/materialtypeAPI", () => ({
  get_all_materialtypes: vi.fn(),
  create_materialtype: vi.fn(),
}));

const mockMaterialsfetchdata: APIMaterialType[] = [
  { id: 1, navn: "grus", forelder: null, farlig: false, synlig: true },
  { id: 2, navn: "planker", forelder: null, farlig: false, synlig: true },
  { id: 3, navn: "flis", forelder: 2, farlig: false, synlig: true },
  { id: 4, navn: "kull", forelder: 2, farlig: false, synlig: true },
];

const render = (element: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return normal_render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>
    </BrowserRouter>,
  );
};
describe("MaterialManagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (get_all_materialtypes as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: mockMaterialsfetchdata,
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
  });

  it("check fetch materials and update store", () => {
    render(<MaterialManagement />);

    expect(get_all_materialtypes).toHaveBeenCalledWith(true);
  });

  it("check creates cards for each parentmaterial", async () => {
    render(<MaterialManagement />);

    await waitFor(() => {
      expect(screen.getByTestId("material-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("material-card-2")).toBeInTheDocument();
      expect(screen.queryByTestId("material-card-3")).not.toBeInTheDocument();
      expect(screen.queryByTestId("material-card-4")).not.toBeInTheDocument();
    });
  });

  it("check search by parent and submaterial", async () => {
    render(<MaterialManagement />);

    const searchInput = screen.getByLabelText("Søk materiale");

    await userEvent.type(searchInput, "gr");
    expect(screen.getByTestId("material-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("material-card-2")).not.toBeInTheDocument();
    expect(screen.queryByTestId("material-card-3")).not.toBeInTheDocument();
    expect(screen.queryByTestId("material-card-4")).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "plank");
    expect(screen.getByTestId("material-card-2")).toBeInTheDocument();
    expect(screen.queryByTestId("material-card-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("material-card-3")).not.toBeInTheDocument();
    expect(screen.queryByTestId("material-card-4")).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "flis");
    expect(screen.getByTestId("material-card-2")).toBeInTheDocument();
    expect(screen.queryByTestId("material-card-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("material-card-3")).not.toBeInTheDocument();
    expect(screen.queryByTestId("material-card-4")).not.toBeInTheDocument();
  });

  it("check error loading materials", async () => {
    (get_all_materialtypes as ReturnType<typeof vi.fn>).mockRejectedValue(
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

    render(<MaterialManagement />);

    await waitFor(() => {
      expect(screen.getByText("Error loading materials")).toBeInTheDocument();
    });
  });

  it("check no materials message", async () => {
    (get_all_materialtypes as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: [],
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<MaterialManagement />);

    await waitFor(() => {
      expect(screen.getByText("Ingen materialer funnet.")).toBeInTheDocument();
    });
  });

  it("check add new material", async () => {
    (create_materialtype as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      statusText: "OK",
      data: {
        id: 5,
        navn: "restavfall",
        forelder: null,
        farlig: true,
        synlig: false,
      },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<MaterialManagement />);

    await waitFor(() => {
      expect(
        screen.getByTestId("materialmanagement-add-btn"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("materialmanagement-add-btn"));

    fireEvent.change(screen.getByLabelText("Materialnavn"), {
      target: { value: "restavfall" },
    });
    fireEvent.click(screen.getByLabelText("Farlig materiale"));
    fireEvent.click(screen.getByText("Legg til"));

    await waitFor(() => {
      expect(create_materialtype).toHaveBeenCalledWith({
        id: null,
        navn: "restavfall",
        forelder: null,
        farlig: true,
        synlig: false,
      });
    });

    await waitFor(() => {
      const { materials } = useBoundStore.getState().materialManagementSlice;
      const newmat = materials.find((mat) => mat.id === 5);
      expect(newmat).toEqual({
        id: 5,
        navn: "restavfall",
        forelder: null,
        farlig: true,
        synlig: false,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("material-card-5")).toBeInTheDocument();
    });
  });
});
