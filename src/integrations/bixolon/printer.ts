export const BIXOLON_SRP_E302 = {
	name: "BIXOLON_SRP_E302",
	paperWidth: 80, // 80mm
	dpi: 203,
	maxCharsPerLine: 42, // fonta at 203dpi on 80mm
} as const;

export const RECEIPT_CONTENT_ID = "receipt-content";

export const RECEIPT_THERMAL_CLASS =
	"receipt-thermal font-mono text-[#1a1a1a] select-none";

export const RECEIPT_PADDING_MM = 3;

export const RECEIPT_BIXOLON_TOP_FEED = 2;
export const RECEIPT_BIXOLON_BOTTOM_FEED = 3;

export const THERMAL_PAGE_STYLE = `
  @page {
    size: 80mm auto;
    margin: 0mm;
  }
  @media print {
    html, body {
      height: 100%;
      margin: 0 !important;
      padding: 0 !important;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    #${RECEIPT_CONTENT_ID},
    .receipt-thermal {
      box-sizing: border-box;
      width: 80mm;
      padding: ${RECEIPT_PADDING_MM}mm;
    }
    .no-print {
      display: none !important;
    }
  }
`;

export const BIXOLON_DEFAULT_SETTINGS = {
	ipAddr: "127.0.0.1",
	shopID: "BGATE_SAMPLE_SHOP",
	devID: "local_printer",
};
