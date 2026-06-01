export const BIXOLON_SRP_E302 = {
	name: "BIXOLON_SRP_E302",
	paperWidth: 80, // 80mm
	dpi: 203,
	maxCharsPerLine: 42, // fonta at 203dpi on 80mm
} as const;

export const RECEIPT_CONTENT_ID = "receipt-content";


export const RECEIPT_THERMAL_CLASS =
	"receipt-thermal font-mono text-black select-none";

export const RECEIPT_PADDING_MM = 4;

export const RECEIPT_BIXOLON_TOP_FEED = 2;
export const RECEIPT_BIXOLON_BOTTOM_FEED = 5;

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

export const BIXOLON_DEFAULT_SETTINGS = {
	ipAddr: "127.0.0.1",
	shopID: "BGATE_SAMPLE_SHOP",
	devID: "local_printer",
};
