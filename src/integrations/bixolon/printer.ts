export const BIXOLON_SRP_E302 = {
  name: "BIXOLON_SRP_E302",
  paperWidth: 80, // 80mm
  dpi: 203,
  maxCharsPerLine: 42, // fonta at 203dpi on 80mm
} as const;

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
  }
`;

export const BIXOLON_DEFAULT_SETTINGS = {
  ipAddr: "127.0.0.1",
  shopID: "BGATE_SAMPLE_SHOP",
  devID: "local_printer",
};
