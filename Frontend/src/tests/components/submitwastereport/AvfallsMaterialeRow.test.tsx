import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useBoundStore } from "../../../store/Store";
import userEvent from "@testing-library/user-event";
import  {AvfallsMaterialeRow} from "../../../components/submitwastereport/AvfallsMaterialeRow";
import { APIMaterialType } from "../../../api/models";

const mockmaterial1: APIMaterialType = {
    id: 1,
    forelder: null,
    navn: "treverk",
    farlig: false,
    synlig: true
}

const mockmaterial2: APIMaterialType = {
    id: 5,
    forelder: null,
    navn: "trykkimp treverk",
    farlig: false,
    synlig: true
}



describe("AvfallsMaterialeRow", () => {
    beforeEach(() => {
        useBoundStore.setState({
          wasteReportForm: {
            ...useBoundStore.getState().wasteReportForm,
            wasteReport: {
              ...useBoundStore.getState().wasteReportForm.wasteReport,
              avfall: {
                ordinert: [
                  {
                    id: 1,
                    plannedAmount: 0,
                    actualAmount: 0,
                    amountToFacility: 0,
                    amountToReuse: 0,
                    facility: "",
                  },
                    {
                        id: 5,
                        plannedAmount: 0,
                        actualAmount: 0,
                        amountToFacility: 0,
                        amountToReuse: 0,
                        facility: "",
                    }
                ],
                farlig: []
              }
            }
          }
        });
      });
 
    it("check render the row and inputs", () => {
        render(<AvfallsMaterialeRow material={mockmaterial1} />);
        expect(screen.getByText("treverk")).toBeInTheDocument();
        expect(screen.getByTestId("form-avfallsrow-plannedamount")).toBeInTheDocument();
        expect(screen.getByTestId("form-avfallsrow-actualamount")).toBeInTheDocument();
        expect(screen.getByTestId("form-avfallsrow-difference")).toBeInTheDocument();
        expect(screen.getByTestId("form-avfallsrow-tofacility")).toBeInTheDocument();   
        expect(screen.getByTestId("form-avfallsrow-toreuse")).toBeInTheDocument();
        expect(screen.getByTestId("form-avfallsrow-facility")).toBeInTheDocument();
        expect(screen.getByTestId("MoreVertIcon")).toBeInTheDocument();
    });

    it("check correct updating of row state", async () => {
        render(<AvfallsMaterialeRow material={mockmaterial1} />);
        const planned = "1000";
        const actual = "2000";
        const tofactility = "3000";
        const reuse = "4000";
        const facility = "trondheim avfall";

        await userEvent.type(within(screen.getByTestId("form-avfallsrow-plannedamount")).getByRole("spinbutton"), planned);
        await userEvent.type(within(screen.getByTestId("form-avfallsrow-actualamount")).getByRole("spinbutton"), actual);
        await userEvent.type(within(screen.getByTestId("form-avfallsrow-tofacility")).getByRole("spinbutton"), tofactility);
        await userEvent.type(within(screen.getByTestId("form-avfallsrow-toreuse")).getByRole("spinbutton"), reuse);
        await userEvent.type(within(screen.getByTestId("form-avfallsrow-facility")).getByRole("textbox"), facility);
        
      
        await waitFor(() => {
            const difference = parseFloat(actual) - parseFloat(planned);
            expect(screen.getByTestId("form-avfallsrow-difference")).toHaveTextContent(difference.toString());

            const { wasteReportForm } = useBoundStore.getState();
            const row = wasteReportForm.wasteReport.avfall.ordinert.find((i) => i.id === mockmaterial1.id);
            if (!row) {
                throw new Error("Row not found");
            }
            expect(row.plannedAmount).toBe(parseFloat(planned));
            expect(row.actualAmount).toBe(parseFloat(actual));
            expect(row.amountToFacility).toBe(parseFloat(tofactility));
            expect(row.amountToReuse).toBe(parseFloat(reuse));
            expect(row.facility).toBe(facility);
          });
    });

    it("check handle delete", async () => {
        render(<AvfallsMaterialeRow material={mockmaterial1} />);
        await userEvent.click(screen.getByTestId("MoreVertIcon"));
        await userEvent.click(screen.getByText("Slett"));
        await waitFor(() => {
            const { wasteReportForm } = useBoundStore.getState();
            const ids = wasteReportForm.wasteReport.avfall.ordinert.map((i) => i.id);
            expect(ids).not.toContain(mockmaterial1.id);
          });
    });

    it("check handle other delete", async () => {
        render(<AvfallsMaterialeRow material={mockmaterial2} />);
        await userEvent.click(screen.getByTestId("MoreVertIcon"));
        await userEvent.click(screen.getByText("Slett"));
        await waitFor(() => {
            const { wasteReportForm } = useBoundStore.getState();
            const ids = wasteReportForm.wasteReport.avfall.ordinert.map((i) => i.id);
            expect(ids).not.toContain(mockmaterial2.id);
          });
    });

  
});
