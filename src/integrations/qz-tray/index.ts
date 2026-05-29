export {
  connectQZ,
  disconnectQZ,
  isQZConnected,
  getQZPrinterName,
  QZ_PRINTER_NAME,
} from "./client";

export {
  buildOrderReceipt,
  printOrderReceiptQZ,
  printSalesXReadingQZ,
  printCashCountQZ,
  printCupsSalesQZ,
  printRevenueQZ,
} from "./receipt-builder";

export type { CupSale } from "./receipt-builder";
