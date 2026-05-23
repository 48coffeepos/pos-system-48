export {
  THERMAL_PAGE_STYLE,
  BIXOLON_SRP_E302,
} from "./printer";

export {
  loadBixolonSDK,
  isBixolonSDKLoaded,
  getBixolonSDK,
  sendToPrinter,
  resetPrinter,
} from "./web-print-sdk";

export {
  printOrderReceipt,
  printSalesXReading,
  printCashCount,
} from "./receipt-builder";

export type {
  BixolonSDKInstance,
  BixolonConnectionConfig,
  BixolonReceiptData,
  BixolonReceiptLine,
  BixolonReceiptSection,
} from "./types";
