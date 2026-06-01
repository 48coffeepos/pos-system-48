export const RECEIPT_CONTENT_ID = "receipt-content";

export const RECEIPT_THERMAL_CLASS =
	"receipt-thermal font-mono text-black select-none";

export const RECEIPT_PADDING_MM = 4;

export const THERMAL_PAGE_STYLE = `
  @page {
    margin: 0mm;
  }
  @media print {
    html, body {
      height: auto !important;
      min-height: 0 !important;
      margin: 0mm !important;
      padding: 0mm !important;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background-color: #ffffff;
      color: #000000 !important;
    }
    #${RECEIPT_CONTENT_ID},
    .receipt-thermal {
      box-sizing: border-box;
      max-width: 80mm;
      padding: ${RECEIPT_PADDING_MM}mm;
      padding-bottom: 12mm !important;
      color: #000000 !important;
      margin: 0mm auto !important;
    }
    * {
      color: #000000 !important;
      opacity: 1 !important;
      border-color: #000000 !important;
      text-shadow: none !important;
      box-shadow: none !important;
    }
    .no-print, button, [role="dialog"] {
      display: none !important;
    }
  }
`;
