import { beforeEach, describe, vi, it, expect } from "vitest";
import { post_wastereport } from "../../../api/wastereportAPI";
import { render as normal_render, screen, waitFor } from "@testing-library/react";
import { SubmitReportPage } from "../../../pages/SubmitReportPage";
import { useBoundStore } from "../../../store/Store";
import userEvent from "@testing-library/user-event";
import { WasteReport } from "../../../store/wastereportFormSlice";
import { AxiosError, AxiosHeaders } from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../../api/wastereportAPI", () => ({
    post_wastereport: vi.fn(),
}));

// for some reason when post_wastereport is mocked (not an issue with any other mock), tests run fine, but logs error about cross-origin issues with localhost:3000?
// with this, the error it not shown
vi.stubGlobal("XMLHttpRequest", class {
    open() {}
});



const reportstate: WasteReport = {
    gjelder: {
        tiltak: {
            berortBRA: 405,
            bygningstype: "betongg",
            konstruksjonstype: "betong",
            handtering: "alt hives",
            type: "nybygg"
        },
        eiendom: {
            address: "addreeessse",
            postalCode: "11000",
            postalPlace: "trondheim"
        }
    },
    avfall: {
        ordinert: [
            {
                id: 1,
                plannedAmount: 3,
                actualAmount: 4,
                amountToFacility: 6,
                amountToReuse: 5,
                facility: "anlegg1",
            },
        ],
        farlig: [
            {
                id: 2,
                plannedAmount: 33,
                actualAmount: 44,
                amountToFacility: 66,
                amountToReuse: 55,
                facility: "anlegg2",
            }
        ]
    },
    bygning: 1000,
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



describe("SubmitReportPage", () => {
    beforeEach(() => {

        useBoundStore.setState({
            wasteReportForm: {
                ...useBoundStore.getState().wasteReportForm,
                wasteReport: {
                    ...useBoundStore.getState().wasteReportForm.wasteReport,
                    ...reportstate  
                 
                }
            }
        });

        vi.mocked(post_wastereport).mockResolvedValue({
            status: 200,
            statusText: "OK",
            data: {},
            headers: {},
            config: { headers: new AxiosHeaders() },
          });
    });

    it("check correct state sent on submit", async () => {
        vi.mocked(post_wastereport).mockResolvedValue({
            status: 200,
            statusText: "OK",
            data: {},
            headers: {},
            config: { headers: new AxiosHeaders() },
        });

        render(<SubmitReportPage />);
       
        await userEvent.click(screen.getByTestId("form-submit-btn"));


        await waitFor(() => {
            // everything but timestamp
            expect(post_wastereport).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: null,
                    bygning: reportstate.bygning,
                    address: reportstate.gjelder.eiendom.address,
                    postalcode: parseInt(reportstate.gjelder.eiendom.postalCode),
                    postalplace: reportstate.gjelder.eiendom.postalPlace,
                    berortbra: reportstate.gjelder.tiltak.berortBRA,
                    bygningstype: reportstate.gjelder.tiltak.bygningstype,
                    konstruksjonstype: reportstate.gjelder.tiltak.konstruksjonstype,
                    handtering: reportstate.gjelder.tiltak.handtering,
                    type: reportstate.gjelder.tiltak.type,
                    materialer: expect.arrayContaining(
                        reportstate.avfall.ordinert.concat(reportstate.avfall.farlig).map((material) =>
                            expect.objectContaining({
                                id: null,
                                materiale: material.id,
                                planlagtmengde: material.plannedAmount,
                                faktiskmengde: material.actualAmount,
                                mengdetilgjenbruk: material.amountToReuse,
                                mengdetilanlegg: material.amountToFacility,
                                anlegg: material.facility,
                                totalmengde: 0,
                            })
                        )
                    ),
                })
            );
        });

    });

    it("check status popup success", async () => {
        vi.mocked(post_wastereport).mockResolvedValue({
            status: 200,
            statusText: "OK",
            data: {},
            headers: {},
            config: { headers: new AxiosHeaders() },
        });
        render(<SubmitReportPage />);
        await userEvent.click(screen.getByTestId("form-submit-btn"));
        await waitFor(() => {
            expect(screen.getByText("Rapport sent inn")).toBeInTheDocument();
        });
    });

    it("check status 400", async () => {
        vi.mocked(post_wastereport).mockRejectedValue(new AxiosError("error", "400", {
            headers: new AxiosHeaders(),
        }, {}, {
            status: 400,
            statusText: "bad request",
            headers: {},
            config: { headers: new AxiosHeaders() },
            data: {},
        }));

        render(<SubmitReportPage />);
        await userEvent.click(screen.getByTestId("form-submit-btn"));
        await waitFor(() => {
            expect(screen.getByText("Rapporten mangler felter")).toBeInTheDocument();
        });
    });

    it("check status 500", async () => {
        vi.mocked(post_wastereport).mockRejectedValue(new AxiosError("error", "500", {
            headers: new AxiosHeaders(),
        }, {}, {
            status: 500,
            statusText: "server error",
            headers: {},
            config: { headers: new AxiosHeaders() },
            data: {},
        }));

        render(<SubmitReportPage />);
        await userEvent.click(screen.getByTestId("form-submit-btn"));
        await waitFor(() => {
            expect(screen.getByText("Serverfeil")).toBeInTheDocument();
        });
    });

    it("check status unknown error", async () => {
        vi.mocked(post_wastereport).mockRejectedValue(new AxiosError("error", "50000", {
            headers: new AxiosHeaders(),
        }, {}, {
            status: 50000,
            statusText: "error",
            headers: {},
            config: { headers: new AxiosHeaders() },
            data: {},
        }));

        render(<SubmitReportPage />);
        await userEvent.click(screen.getByTestId("form-submit-btn"));
        await waitFor(() => {
    
            expect(screen.getByText("Ukjent feil")).toBeInTheDocument();
        });
    });



});