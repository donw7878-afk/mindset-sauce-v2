"use client";

/** Print / save the Certificate as PDF via the browser's print dialog. */
export default function PrintButton() {
  return (
    <button className="btnSecondary" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
