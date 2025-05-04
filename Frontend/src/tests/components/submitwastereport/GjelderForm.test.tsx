import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useBoundStore } from "../../../store/Store";
import userEvent from "@testing-library/user-event";
import { GjelderForm } from "../../../components/submitwastereport/GjelderForm";

describe("GjelderForm", () => {
  it("check render the form and inputs", () => {
    render(<GjelderForm />);
    expect(
      screen.getByTestId("reportform-gjelder-adresse-inp"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-postnr-inp"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-poststed-inp"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-tiltak-nybygg-radio"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-tiltak-ombygging-radio"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-tiltak-riving-radio"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-berortbra-inp"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-bygningstype-inp"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-konstruksjonstype-inp"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reportform-gjelder-beskrivelse-inp"),
    ).toBeInTheDocument();
  });

  it("check correct updating of form state", async () => {
    render(<GjelderForm />);

    // address,postnr/sted (eiendom/byggested)
    const address = "kognens gate 3000";
    const postnr = "5000";
    const poststed = "trondheim";
    const inpaddr = within(
      screen.getByTestId("reportform-gjelder-adresse-inp"),
    ).getByRole("textbox");
    await userEvent.type(inpaddr, address);
    const inppostnr = within(
      screen.getByTestId("reportform-gjelder-postnr-inp"),
    ).getByRole("spinbutton");
    await userEvent.type(inppostnr, postnr);
    const inppoststed = within(
      screen.getByTestId("reportform-gjelder-poststed-inp"),
    ).getByRole("textbox");
    await userEvent.type(inppoststed, poststed);
    // tiltaket gjelder (radio,bra,type, beskrivelse)
    const radionybygg = within(
      screen.getByTestId("reportform-gjelder-tiltak-nybygg-radio"),
    ).getByRole("radio");
    const radioriving = within(
      screen.getByTestId("reportform-gjelder-tiltak-riving-radio"),
    ).getByRole("radio");
    const radiombygging = within(
      screen.getByTestId("reportform-gjelder-tiltak-ombygging-radio"),
    ).getByRole("radio");

    await userEvent.click(radionybygg);
    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      expect(wasteReportForm.wasteReport.gjelder.tiltak.type).toBe("nybygg");
    });
    await userEvent.click(radiombygging);
    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      expect(wasteReportForm.wasteReport.gjelder.tiltak.type).toBe("ombygging");
    });
    await userEvent.click(radioriving);
    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      expect(wasteReportForm.wasteReport.gjelder.tiltak.type).toBe("rivning");
    });

    const selectedradio = "rivning";
    const berortbra = "1000";
    const bygningstype = "betong";
    const konstruksjonstype = "betonghus";
    const beskrivelse =
      "skal rive hele huset og sende det på trondheim gjenvinningsstasjon";
    const inpberortbra = within(
      screen.getByTestId("reportform-gjelder-berortbra-inp"),
    ).getByRole("textbox");
    await userEvent.type(inpberortbra, berortbra);
    const inpbygningstype = within(
      screen.getByTestId("reportform-gjelder-bygningstype-inp"),
    ).getByRole("textbox");
    await userEvent.type(inpbygningstype, bygningstype);
    const inpkonstruksjonstype = within(
      screen.getByTestId("reportform-gjelder-konstruksjonstype-inp"),
    ).getByRole("textbox");
    await userEvent.type(inpkonstruksjonstype, konstruksjonstype);
    const inpbeskrivelse = within(
      screen.getByTestId("reportform-gjelder-beskrivelse-inp"),
    ).getByRole("textbox");
    await userEvent.type(inpbeskrivelse, beskrivelse);

    await waitFor(() => {
      const { wasteReportForm } = useBoundStore.getState();
      expect(wasteReportForm.wasteReport.gjelder.eiendom.address).toBe(address);
      expect(wasteReportForm.wasteReport.gjelder.eiendom.postalCode).toBe(
        postnr,
      );
      expect(wasteReportForm.wasteReport.gjelder.eiendom.postalPlace).toBe(
        poststed,
      );
      expect(wasteReportForm.wasteReport.gjelder.tiltak.type).toBe(
        selectedradio,
      );
      expect(wasteReportForm.wasteReport.gjelder.tiltak.berortBRA).toBe(
        parseFloat(berortbra),
      );
      expect(wasteReportForm.wasteReport.gjelder.tiltak.bygningstype).toBe(
        bygningstype,
      );
      expect(wasteReportForm.wasteReport.gjelder.tiltak.konstruksjonstype).toBe(
        konstruksjonstype,
      );
      expect(wasteReportForm.wasteReport.gjelder.tiltak.handtering).toBe(
        beskrivelse,
      );
    });
  });
});
