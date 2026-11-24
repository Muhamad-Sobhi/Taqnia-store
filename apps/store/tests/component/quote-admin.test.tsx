import { createElement, type ReactNode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { QuoteDashboard } from "@/components/features/admin/quote-dashboard";
import { QuoteDetails } from "@/components/features/admin/quote-details";
import { mockQuotes } from "@/mocks/quote-admin";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) =>
    createElement("a", { href }, children),
}));

describe("quote admin prototype", () => {
  it("filters mock quotes by reference and status without persisting changes", () => {
    render(<QuoteDashboard locale="en" />);

    expect(screen.getAllByText("QT-TEST-1001").length).toBeGreaterThan(0);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "1005" } });
    const table = screen.getByRole("table");
    expect(within(table).getByText("QT-TEST-1005")).toBeVisible();
    expect(within(table).queryByText("QT-TEST-1001")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "approved" } });
    expect(screen.getAllByText("Approved").length).toBeGreaterThan(0);
  });

  it("keeps displayed prices separate and updates confirmed totals locally", () => {
    const quote = mockQuotes.find((item) => item.reference === "QT-TEST-1001");
    expect(quote).toBeDefined();
    if (!quote) return;

    render(<QuoteDetails locale="en" quote={quote} />);

    expect(screen.getByText("Historical displayed total")).toBeVisible();
    const firstPriceInput = screen.getByLabelText("Confirmed unit price: Test Network Router");
    fireEvent.change(firstPriceInput, { target: { value: "800" } });

    expect(screen.getByText(/Temporary changes are not saved/)).toBeVisible();
    expect(
      screen.getByText("These price edits are temporary and are not sent or saved."),
    ).toBeVisible();
  });

  it("blocks conversion when approval or confirmed prices are incomplete", () => {
    const quote = mockQuotes.find((item) => item.reference === "QT-TEST-1002");
    expect(quote).toBeDefined();
    if (!quote) return;

    render(<QuoteDetails locale="en" quote={quote} />);

    const approvedButton = screen.getAllByRole("button", { name: "Approved" })[0];
    if (!approvedButton) throw new Error("Approved transition was not rendered.");
    fireEvent.click(approvedButton);
    const conversionHeading = screen.getByRole("heading", {
      name: "Sales Order conversion preview",
    });
    const conversion = conversionHeading.parentElement;
    if (!conversion) throw new Error("Conversion preview section was not rendered.");

    expect(within(conversion).getByText("Explicit customer approval is required.")).toBeVisible();
    expect(
      within(conversion).getByText("All requested lines need confirmed prices."),
    ).toBeVisible();
    expect(
      within(conversion).getByRole("button", {
        name: "Conversion action unavailable in prototype",
      }),
    ).toBeDisabled();
  });

  it("renders bilingual content and RTL-safe quote details", () => {
    const quote = mockQuotes.find((item) => item.reference === "QT-TEST-1003");
    expect(quote).toBeDefined();
    if (!quote) return;

    render(<QuoteDetails locale="ar" quote={quote} />);
    expect(screen.getByRole("heading", { name: "تفاصيل عرض السعر" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "مراجعة التسعير" })).toBeVisible();
  });
});
