import { APIWasteReportOverview } from "../../../api/models";
import ReportCard from "../../../components/viewReports/ReportCard";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi, it, describe, expect } from "vitest";


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
}

describe("ReportCard", () => {
    it("check render with correct props", () => {
        const r = render(<ReportCard report={mockreport} onViewReport={vi.fn()} />);
        
        expect(r.container).toHaveTextContent("Rapport-ID: 50");
        expect(screen.getByText("Kongens gate 3000")).toBeInTheDocument();
        expect(screen.getByText("Bruksnr.:")).toBeInTheDocument();
        expect(screen.getByText("Seksjonsnr.:")).toBeInTheDocument();
        expect(r.container).toHaveTextContent("Total mengde avfall: 1000 tonn");
        expect(r.container).toHaveTextContent("Byggeår: 1500");
        expect(r.container).toHaveTextContent("Dato levert: 2025-01-01");
        expect(screen.getByTestId("show-report-btn")).toBeInTheDocument();

    });

    it("check onclick", () => {
        const onViewReport = vi.fn();
        render(<ReportCard report={mockreport} onViewReport={onViewReport} />);
        fireEvent.click(screen.getByText("Se detaljert rapport"));
        expect(onViewReport).toHaveBeenCalledWith("50");
    });
});